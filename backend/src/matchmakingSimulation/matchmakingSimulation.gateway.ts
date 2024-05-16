import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchmakingSimulationService } from './matchmakingSimulation.service';
import { TestUser } from './i/matchmakingSimulation.i-testUser';

@WebSocketGateway()
export class MatchmakingSimulationGateway implements OnGatewayDisconnect {
    constructor(
        private matchmakingSimulationService: MatchmakingSimulationService,
    ) { }

    @WebSocketServer()
    server: Server;

    handleDisconnect(client: any) {
        this.matchmakingSimulationService.userLeftMmSimVue(client);
    }

    @SubscribeMessage('resetMatchmakingSimulation')
    handleResetMatchmakingSimulation(@ConnectedSocket() client: Socket) {
        this.matchmakingSimulationService.clearQueue();
    }

    @SubscribeMessage('addUserToQueue')
    handleAddUserToQueue(@ConnectedSocket() client: Socket, @MessageBody() user: TestUser) {
        this.matchmakingSimulationService.addUserToQueue(user);
    }

    @SubscribeMessage('playerJoinedMmSimVue')
    handlePlayerJoinedMmVue(@ConnectedSocket() client: Socket) {
        this.matchmakingSimulationService.userJoinedMmSimVue(client);
        client.emit('mMSettings', this.matchmakingSimulationService.getSettings());
    }

    @SubscribeMessage('playerLeftMmSimVue')
    handlePlayerLeftMmVue(@ConnectedSocket() client: Socket) {
        this.matchmakingSimulationService.userLeftMmSimVue(client);
    }

}