import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingController } from './matchmaking.controller';
import { MatchmakingService } from './matchmaking.service';
import { GameModule } from 'src/game/game.module';

@Module({
    imports: [PrismaModule, GameModule],
    controllers: [MatchmakingController],
    providers: [MatchmakingGateway, MatchmakingService],
})
export class MatchmakingModule { }
