import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GlobalChatGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('sendGlobalChatMessage')
    handleMessage(@MessageBody() data: { text: string }, @ConnectedSocket() client: Socket): void {
        const username = client.data.user?.username;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        if(username){
            this.server.emit('sendGlobalChatMessage', { username, text: data.text, timestamp });
        }        
    }

}