import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingController } from './matchmaking.controller';
import { MatchmakingService } from './matchmaking.service';

@Module({
    imports: [PrismaModule],
    controllers: [MatchmakingController],
    providers: [MatchmakingGateway, MatchmakingService],
})
export class MatchmakingModule { }
