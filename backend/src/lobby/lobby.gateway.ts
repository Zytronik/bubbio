import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyData, Message, RoomUserList } from './data/lobby.data';

@WebSocketGateway()
export class LobbyGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private lobbyData: LobbyData = new LobbyData();

  handleConnection(client: any) {
    const username = 'User-' + Math.random().toString(36).substring(5);
    this.addUserToNoRoom(client, username);
    this.lobbyData.logRoomsInformations('User connected');
  }

  @SubscribeMessage('disconnecting')
  handleDisconnecting(@ConnectedSocket() client: Socket) {
    const roomId = this.lobbyData.getCurrentRoomId(client.id);
    if (roomId) { //if user in room
      this.sendLeaveMessage(client.id, roomId);
      this.lobbyData.moveUserToNoRoom(client.id);
      this.updateFrontendRoomUserList(roomId);
    }
    this.removeUserAndLogDisconnection(client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data, @ConnectedSocket() client: Socket) {
    this.processUserJoiningRoom(client, data.roomId);
    this.sendJoinRoomMessage(client.id, data.roomId);
    this.lobbyData.logRoomsInformations('User joined a room');
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket) {
    const roomId = this.lobbyData.getCurrentRoomId(client.id);
    if (roomId) {
      this.sendLeaveMessage(client.id, roomId);
      this.lobbyData.moveUserToNoRoom(client.id);
      this.updateFrontendRoomUserList(roomId);
      this.lobbyData.logRoomsInformations('User left a room');
    } else {
      console.log(`Client Id: ${client.id} is trying to leave a room without being in one`);
    }
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

  private broadcastMessage(roomId: string, text: string, clientId: string) {
    const username = this.lobbyData.getUsername(clientId) || 'Unknown User';
    const message: Message = {
      username: username,
      text: text
    };
    this.server.to(roomId).emit('message', message);
    this.lobbyData.getRoom(roomId)?.messages.push(message);
    this.lobbyData.logRoomsInformations('Message send');
  }

  private addUserToNoRoom(client: any, username: string) {
    this.lobbyData["noRoom"].push({
      clientId: client.id,
      username: username,
    });
  }

  private sendLeaveMessage(clientId: string, roomId: string) {
    const username = this.lobbyData.getUsername(clientId) || 'Unknown User';
    const leaveMessage: Message = {
      username: 'Server',
      text: `${username} left the room.`
    };
    this.server.to(roomId).emit('message', leaveMessage);
    this.lobbyData.getRoom(roomId)?.messages.push(leaveMessage);
  }

  private removeUserAndLogDisconnection(clientId: string) {
    this.lobbyData.removeUserFromAllRooms(clientId);
    this.lobbyData.deleteEmptyRooms();
    this.lobbyData.removeUserFromNoRoom(clientId);
    this.lobbyData.logRoomsInformations('User disconnected');
  }

  private processUserJoiningRoom(client: Socket, roomId: string) {
    if (!this.lobbyData.hasRoom(roomId)) { //if room doesnt exists
      this.lobbyData.setRoom({ roomId: roomId, messages: [], users: [] });
    }
    this.moveUserToRoom(client, roomId);
    this.updateFrontendRoomUserList(roomId);
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
    const joinMessage = `${username} joined the room.`;
    const message: Message = {
      username: 'Server',
      text: joinMessage
    };
    this.server.to(roomId).emit('message', message);
    this.lobbyData.getRoom(roomId)?.messages.push(message);
  }
}