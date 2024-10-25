import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserSession } from 'src/_interface/session.userSession';
import { SessionService } from './session.service';

@WebSocketGateway({
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes recovery window
    skipMiddlewares: true, // Skips middleware checks during reconnection
  },
})
export class SessionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private activeUsers: Map<string, UserSession> = new Map();

  constructor(private readonly sessionService: SessionService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    const isGuest = client.handshake.query.isGuest === 'true';
    const guestUsername = client.handshake.query.guestUsername as string;

    let userSession: UserSession;

    if (this.sessionService.isValidToken(token)) {
      userSession = await this.sessionService.handleUserConnection(
        client,
        token,
        this.activeUsers,
        this.server,
      );
    } else if (isGuest && guestUsername) {
      userSession = this.sessionService.handleGuestConnection(
        client,
        guestUsername,
        this.activeUsers,
        this.server,
      );
    } else {
      userSession = this.sessionService.handleSpectatorConnection(
        client,
        this.activeUsers,
        this.server,
      );
    }

    client.emit('userConnected', userSession);

    this.sessionService.logConnectionStatus(
      client,
      userSession,
      this.activeUsers,
    );
  }

  handleDisconnect(client: Socket) {
    const username = this.activeUsers.get(client.id)?.username;
    this.activeUsers.delete(client.id);
    this.server.emit(
      'usersOnline',
      this.sessionService.getActiveUsers(this.activeUsers),
    );
    console.log('------------------------------');
    console.log(`${username} disconnected.`);
  }

  @SubscribeMessage('updateUserPage')
  handleUpdateUserPage(client: Socket, payload: { currentPage: string }) {
    const userSession = this.activeUsers.get(client.id);
    if (userSession) {
      userSession.currentPage = payload.currentPage;
      this.activeUsers.set(client.id, userSession);
    }
  }

  @SubscribeMessage('updateUser')
  async handleUpdateUser(client: Socket) {
    const token = client.handshake.query.token as string;
    const decodedToken = this.sessionService.decodeToken(token);
    const userId = decodedToken.userId;
    const userDetails = await this.sessionService.getDbUserDetails(userId);
    if (userDetails) {
      client.emit('updateUser', userDetails);
    }
  }
}
