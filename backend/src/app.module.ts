import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LobbyGateway } from './lobby/lobby.gateway';
import { AuthModule } from './auth/auth.module';
import { GlobalChatGateway } from './globalChat/globalChat.gateway';
import { GameGateway } from './game/game.main';
import { SprintModule } from './sprint/sprint.module';
import { NewsModule } from './news/news.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { MailModule } from './mailer/mailer.module';
import { MatchmakingGateway } from './matchmaking/matchmaking.gateway';
import { MatchmakingModule } from './matchmaking/matchmaking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    SprintModule,
    NewsModule,
    LeaderboardModule,
    MailModule,
    MatchmakingModule,
  ],
  providers: [LobbyGateway, GameGateway, GlobalChatGateway],
})
export class AppModule { }
