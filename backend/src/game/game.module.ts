import { Module, forwardRef } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MatchmakingModule } from 'src/matchmaking/matchmaking.module';

@Module({
    imports: [forwardRef(() => MatchmakingModule)],
    providers: [GameGateway],
    exports: [GameGateway],
})
export class GameModule { }
