import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LobbyGateway } from './lobby/lobby.gateway';
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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
    GameModule,
    RankedModule,
    UsersModule,
    FriendsModule,
  ],
  providers: [LobbyGateway, GlobalChatGateway,],
})
export class AppModule { }
