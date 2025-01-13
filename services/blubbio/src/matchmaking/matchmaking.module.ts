import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingService } from './matchmaking.service';
import { GameModule } from 'src/game/game.module';
import { RankedModule } from 'src/ranked/ranked.module';
import { UsersModule } from 'src/user/user.module';

@Module({
    imports: [PrismaModule, forwardRef(() => GameModule), RankedModule, UsersModule],
    providers: [MatchmakingGateway, MatchmakingService],
    exports: [MatchmakingService],
})
export class MatchmakingModule { }
