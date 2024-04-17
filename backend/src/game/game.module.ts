import { Module, forwardRef } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MatchmakingModule } from 'src/matchmaking/matchmaking.module';
import { RankedModule } from 'src/ranked/ranked.module';
import { UsersModule } from 'src/user/user.module';

@Module({
    imports: [forwardRef(() => MatchmakingModule), RankedModule, UsersModule],
    providers: [GameGateway],
    exports: [GameGateway],
})
export class GameModule { }
