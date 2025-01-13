import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyData, Message, RoomUserList } from './data/lobby.data';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@WebSocketGateway()
export class LobbyGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
  ) { }
  @WebSocketServer()
  server: Server;

  private lobbyData: LobbyData = new LobbyData();

  async handleConnection(client: Socket) {
    let authPromise;
    const { token, isGuest, guestUsername } = client.handshake.query;

    if (token === "null" && isGuest === "null" && guestUsername === "null") {
      client.data.role = "Spectator";
      client.data.user = { username: "Spectator-" + client.id };
    } else { 
      if (isGuest === 'true') {
        this.handleGuestConnection(client);
        authPromise = Promise.resolve(true);
      } else if (token) {
        authPromise = this.authenticateUser(client);
      }
      this.authenticationPromises.set(client.id, authPromise);
      const isAuthenticated = await authPromise;
      if (!isAuthenticated && !isGuest) {
        client.disconnect();
        return;
      }
    }

    this.addUserToNoRoom(client);
    this.lobbyData.logRoomsInformations('User connected');
  }

  @SubscribeMessage('disconnecting')
  handleDisconnecting(@ConnectedSocket() client: Socket) {
    if (this.isClientLoggedIn(client)) {
      this.userService.updateLastDisconnectedAt(client.data.user.username);
    }
    this.leaveRoom(client);
    this.removeUserAndLogDisconnection(client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const username = client.data.user.username;
    if (!this.isUserInAnyRoom(username)) {
      if (data.roomId && data.roomId.trim() !== '') {
        this.processUserJoiningRoom(client, data.roomId);
        this.sendJoinRoomMessage(client.id, data.roomId);
        this.emitActiveRoomsUpdate();
        this.lobbyData.logRoomsInformations('User joined a room');
      } else {
        console.error(`Invalid Room ID provided by client Id: ${client.id}`);
      }
    } else {
      console.error(`Username: ${username} is already in a room and cannot join another`);
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket) {
    this.leaveRoom(client);
  }


  @SubscribeMessage('message')
  handleMessage(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const roomId = this.lobbyData.getCurrentRoomId(client.id);
    if (roomId) {
      this.broadcastMessage(roomId, data.text, client.id);
    } else {
      console.log(`Client Id: ${client.id} is not in any room and cannot send messages`);
    }
  }

  @SubscribeMessage('updateActiveRooms')
  handleGetActiveRooms(@ConnectedSocket() client: Socket) {
    const activeRoomsInfo = this.lobbyData.getActiveRoomsInfo();
    client.emit('updateActiveRooms', activeRoomsInfo);
  }

  @SubscribeMessage('fetchGlobalStats')
  async handleFetchGlobalStats(@ConnectedSocket() client: Socket) {
    const activeLobbies = this.lobbyData.getActiveRoomsInfo().length;
    const peopleOnline = this.lobbyData["noRoom"].length;
    const registeredUsers = await this.userService.getTotalRegisteredUsersCount();
    client.emit('fetchGlobalStats', {
      peopleOnline,
      registeredUsers,
    });
  }

  @SubscribeMessage('getUserOnlineStatus')
  handleGetUserOnlineStatus(@MessageBody() username, @ConnectedSocket() client: Socket) {
    const status = this.lobbyData.checkUserStatus(username) !== 'notFound' ? true : false;
    client.emit('getUserOnlineStatus', status);
  }

  @SubscribeMessage('isUserInRoomAlready')
  async handleIsUserInRoomAlready(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const isAuthenticated = await this.authenticationPromises.get(client.id) ?? false;
    if (!isAuthenticated) {
      console.error('Authentication required or failed for client:', client.id);
      return;
    }
    const username = client.data.user.username;
    client.emit('isUserInRoomAlready', this.isUserInAnyRoom(username), data.rId);
  }

  private authenticationPromises: Map<string, Promise<boolean>> = new Map();

  async authenticateUser(client: Socket): Promise<boolean> {
    try {
      const token = Array.isArray(client.handshake.query.token)
        ? client.handshake.query.token[0]
        : client.handshake.query.token;

      if (!token) {
        throw new Error('Token not provided');
      }
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET')
      });

      const userDetails = await this.userService.getUserByUsername(payload.username);
      client.data.user = userDetails;
      client.data.role = "User";
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }
  
  isClientLoggedIn(client: Socket): boolean {
    return client.data.role === "User";
  }

  private leaveRoom(client: Socket){
    const roomId = this.lobbyData.getCurrentRoomId(client.id);
    if (roomId) {
      this.sendLeaveMessage(client.id, roomId);
      this.lobbyData.moveUserToNoRoom(client.id);
      this.updateFrontendRoomUserList(roomId);
      this.emitActiveRoomsUpdate();
      this.lobbyData.logRoomsInformations('User left a room');
    } else {
      //console.error(`Client Id: ${client.id} is trying to leave a room without being in one`);
    }
  }

  private handleGuestConnection(client: Socket) {
    const guestUsername = "Guest-" + client.handshake.query.guestUsername || `Guest-${Math.random().toString(36).substring(2, 15)}`;
    client.data.user = { username: guestUsername };
    client.data.role = "Guest";
  }

  private emitActiveRoomsUpdate() {
    const activeRoomsInfo = this.lobbyData.getActiveRoomsInfo();
    this.server.emit('updateActiveRooms', activeRoomsInfo);
  }

  private broadcastMessage(roomId: string, text: string, clientId: string) {
    const username = this.lobbyData.getUsername(clientId) || 'Unknown User';
    this.sendMessageToRoom(
      roomId,
      {
        username: username,
        text: text,
      }
    );
    this.lobbyData.logRoomsInformations('Message send');
  }

  private addUserToNoRoom(client: Socket) {
    if(client.data.user){
      this.lobbyData["noRoom"].push({
        clientId: client.id,
        username: client.data.user.username,
      });
    }
  }

  private sendLeaveMessage(clientId: string, roomId: string) {
    const username = this.lobbyData.getUsername(clientId) || 'Unknown User';
    this.sendMessageToRoom(
      roomId,
      {
        username: 'Server',
        text: `${username} left the room.`
      }
    );
  }

  private removeUserAndLogDisconnection(clientId: string) {
    this.lobbyData.removeUserFromAllRooms(clientId);
    this.lobbyData.deleteEmptyRooms();
    this.lobbyData.removeUserFromNoRoom(clientId);
    this.lobbyData.logRoomsInformations('User disconnected');
  }

  private processUserJoiningRoom(client: Socket, roomId: string) {
    if (!this.lobbyData.hasRoom(roomId)) {
      this.lobbyData.setRoom({ roomId: roomId, messages: [], users: [] });
    }
    this.moveUserToRoom(client, roomId);
    this.updateFrontendRoomUserList(roomId);
  }

  private isUserInAnyRoom(username: string): boolean {
    return this.lobbyData.inRoom.some(room =>
      room.users.some(user => user.username === username)
    );
  }

  private updateFrontendRoomUserList(roomId: string): void {
    const room = this.lobbyData.getRoom(roomId);
    if (room) {
      const roomUserList: RoomUserList = room.users;
      this.server.to(roomId).emit("updateFrontendRoomUserList", roomUserList);
    }
  }

  private moveUserToRoom(client: Socket, roomId: string) {
    const joiningUserIndex = this.lobbyData["noRoom"].findIndex(user => user.clientId === client.id);
    if (joiningUserIndex !== -1) {
      const removedUser = this.lobbyData["noRoom"].splice(joiningUserIndex, 1)[0];
      this.lobbyData.getRoom(roomId).users.push(removedUser);
    }
    client.join(roomId);
  }

  private sendJoinRoomMessage(clientId: string, roomId: string) {
    const username = this.lobbyData.getUsername(clientId) || 'Unknown User';
    this.sendMessageToRoom(
      roomId,
      {
        username: 'Server',
        text: `${username} joined the room.`
      }
    );
  }

  private sendMessageToRoom(roomId: string, msg: Message) {
    if (!roomId || !msg.text || !msg.username) {
      console.error('Invalid parameters for sending message to room.');
      return;
    }
    this.server.to(roomId).emit('message', msg);
    const room = this.lobbyData.getRoom(roomId);
    if (room) {
      room.messages.push(msg);
    } else {
      console.error(`Room with ID ${roomId} not found.`);
    }
  }
}
