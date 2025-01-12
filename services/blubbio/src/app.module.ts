import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GlobalChatGateway } from './globalChat/globalChat.gateway';
import { SprintModule } from './sprint/sprint.module';
import { NewsModule } from './news/news.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { MailModule } from './mailer/mailer.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { GameModule } from './game/game.module';
import { RankedModule } from './ranked/ranked.module';
import { UsersModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';
import { LobbyModule } from './lobby/lobby.module';
import { ScoreModule } from './score/score.module';
import { MatchmakingSimulationModule } from './matchmakingSimulation/matchmakingSimulation.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    SprintModule,
    ScoreModule,
    NewsModule,
    LeaderboardModule,
    MailModule,
    MatchmakingModule,
    GameModule,
    RankedModule,
    UsersModule,
    FriendsModule,
    LobbyModule,
    MatchmakingSimulationModule,
  ],
  providers: [GlobalChatGateway],
})
export class AppModule { }
