import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewsService } from './news.service';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway()
export class NewsGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject(forwardRef(() => NewsService))
        private newsService: NewsService,
    ) {} 

    @SubscribeMessage('fetchNews')
    async handleFetchNews(client: Socket) {
        const newsData = await this.newsService.getNewestNews();
        this.server.emit('updateNews', newsData);
    }
}
