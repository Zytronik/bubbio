import { ConnectedSocket, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from './matchmaking.service';

@WebSocketGateway()
export class MatchmakingGateway implements OnGatewayDisconnect {
    constructor(
        private matchmakingService: MatchmakingService,
    ) { }

    @WebSocketServer()
    server: Server;

    handleDisconnect(client: Socket) {
        if(this.matchmakingService.isLoggedInUser(client)){
            this.matchmakingService.removeUserFromQueue(client.data.user.id);
            this.matchmakingService.userLeftMmVue(client);
        }
    }

    @SubscribeMessage('playerJoinedMmVue')
    handlePlayerJoinedMmVue(@ConnectedSocket() client: Socket) {
        if(this.matchmakingService.isLoggedInUser(client)){
            this.matchmakingService.userJoinedMmVue(client);
        }
    }

    @SubscribeMessage('playerLeftMmVue')
    handlePlayerLeftMmVue(@ConnectedSocket() client: Socket) {
        if(this.matchmakingService.isLoggedInUser(client)){
            this.matchmakingService.userLeftMmVue(client);
        }
    }

    @SubscribeMessage('enterQueue')
    async handleEnterQueue(@ConnectedSocket() client: Socket) {
        if(this.matchmakingService.isLoggedInUser(client)){
            const user = await this.matchmakingService.getGlickoByUserId(client.data.user.id);
            if (user) {
                this.matchmakingService.addUserToQueue(client.data.user.id, user.rating, client);
            }
        }
    }

    @SubscribeMessage('leaveQueue')
    handleLeaveQueue(@ConnectedSocket() client: Socket) {
        if(this.matchmakingService.isLoggedInUser(client)){
            this.matchmakingService.removeUserFromQueue(client.data.user.id);
        }
    }
}