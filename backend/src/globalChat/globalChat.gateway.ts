import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GlobalChatGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('sendGlobalChatMessage')
    handleMessage(@MessageBody() data: { text: string }, @ConnectedSocket() client: Socket): void {
        const username = client.data.user?.username;
        if(username){
            this.server.emit('sendGlobalChatMessage', { username, text: data.text });
        }        
    }

}