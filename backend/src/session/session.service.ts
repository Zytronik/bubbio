import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import { UserDetails, UserSession } from 'src/_interface/session.userSession';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  isValidToken(token: string): boolean {
    return token && token !== 'null';
  }

  async handleUserConnection(
    client: Socket,
    token: string,
    activeUsers: Map<string, UserSession>,
    server: Server,
  ): Promise<UserSession> {
    try {
      const decodedToken = this.decodeToken(token);
      const userId = decodedToken.userId;
      const username = decodedToken.username.toUpperCase();
      const userDetails = await this.userService.getUserDetailsById(userId);
      const isRanked = await this.userService.isRanked(userId);

      const userSession: UserSession = {
        role: 'user',
        username,
        currentPage: '/',
        userDetails,
        isRanked: isRanked,
        clientId: client.id,
      };

      activeUsers.set(client.id, userSession);
      server.emit('usersOnline', this.getActiveUsers(activeUsers));

      return userSession;
    } catch (error) {
      console.error('Unauthorized access attempt', error);
      client.disconnect();
      throw new UnauthorizedException('Invalid token');
    }
  }

  handleGuestConnection(
    client: Socket,
    guestUsername: string,
    activeUsers: Map<string, UserSession>,
    server: Server,
  ): UserSession {
    const username = 'Guest-' + guestUsername;

    const guestSession: UserSession = {
      role: 'guest',
      username: username,
      currentPage: '/',
      userDetails: null,
      isRanked: false,
      clientId: client.id,
    };

    activeUsers.set(client.id, guestSession);
    server.emit('usersOnline', this.getActiveUsers(activeUsers));

    return guestSession;
  }

  handleSpectatorConnection(
    client: Socket,
    activeUsers: Map<string, UserSession>,
    server: Server,
  ): UserSession {
    const username = `Spectator-${client.id}`;

    const spectatorSession: UserSession = {
      role: 'spectator',
      username: username,
      currentPage: '/',
      userDetails: null,
      isRanked: false,
      clientId: client.id,
    };

    activeUsers.set(client.id, spectatorSession);
    server.emit('usersOnline', this.getActiveUsers(activeUsers));

    return spectatorSession;
  }

  getActiveUsers(activeUsers: Map<string, UserSession>) {
    return Array.from(activeUsers.values());
  }

  logConnectionStatus(
    client: Socket,
    userSession: UserSession,
    activeUsers: Map<string, UserSession>,
  ) {
    console.log('------------------------------');
    if (client.recovered) {
      console.log(`${userSession.username} reconnected.`);
    } else {
      console.log(`${userSession.username} connected.`);
    }
    console.log('Currently active users:', activeUsers.size);
    activeUsers.forEach(value => {
      console.log(value.username, value.clientId);
    });
    console.log('------------------------------');
  }

  decodeToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async getDbUserDetails(userID: number): Promise<UserDetails> {
    return await this.userService.getUserDetailsById(userID);
  }
}
