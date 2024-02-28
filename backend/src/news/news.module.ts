import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsGateway } from './news.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [NewsService, NewsGateway],
    exports: [NewsGateway, NewsService]
})
export class NewsModule { }
