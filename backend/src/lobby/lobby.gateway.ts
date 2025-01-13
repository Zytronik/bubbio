import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  JoinLobbyPayload,
  LeaveLobbyPayload,
  LobbyUpdate,
} from 'src/_interface/lobby.lobby';
import { LobbyService } from './lobby.service';

@WebSocketGateway({
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
  },
})
export class LobbyGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly lobbyService: LobbyService) {}

  @SubscribeMessage('createLobby')
  handleCreateLobby(client: Socket): void {
    if (this.lobbyService.isClientInLobby(client)) {
      console.error('Client is already in a lobby');
      return;
    }

    const lobby = this.lobbyService.createLobby(client);
    client.join(lobby.id);
    this.broadcastLobbyList();
    client.emit('lobbyCreated', lobby);
  }

  @SubscribeMessage('joinLobby')
  handleJoinLobby(client: Socket, payload: JoinLobbyPayload): void {
    const lobby = this.lobbyService.joinLobby(client, payload);
    if (lobby) {
      client.join(payload.lobbyId);
      this.broadcastLobbyUpdate(payload.lobbyId);
      client.emit('lobbyJoined', lobby);
    } else {
      client.emit('lobbyJoinFailed', { lobbyId: payload.lobbyId });
    }
  }

  @SubscribeMessage('leaveLobby')
  handleLeaveLobby(client: Socket, payload: LeaveLobbyPayload): void {
    const lobby = this.lobbyService.leaveLobby(client, payload);
    client.leave(payload.lobbyId);

    if (!lobby) {
      this.broadcastLobbyList();
    } else {
      this.broadcastLobbyUpdate(payload.lobbyId);
    }
  }

  @SubscribeMessage('fetchLobbies')
  handleFetchLobbies(client: Socket): void {
    const lobbyList = this.lobbyService.fetchLobbies();
    client.emit('lobbyList', { lobbies: lobbyList });
  }

  private broadcastLobbyList(): void {
    const lobbyList = this.lobbyService.fetchLobbies();
    this.server.emit('lobbyList', { lobbies: lobbyList });
  }

  private broadcastLobbyUpdate(lobbyId: string): void {
    const lobby = this.lobbyService.fetchLobbies().find(l => l.id === lobbyId);
    if (lobby) {
      const update: LobbyUpdate = {
        lobbyId,
        users: lobby.users,
      };
      this.server.to(lobbyId).emit('lobbyUpdate', update);
    }
  }

  handleDisconnect(client: Socket) {
    const rooms = this.lobbyService.getClientRooms(client);
    rooms.forEach(roomId => {
      this.handleLeaveLobby(client, { lobbyId: roomId });
    });
  }
}
