import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LobbyGateway } from './lobby/lobby.gateway';
import { GameGateway } from './game/game.gateway';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  providers: [LobbyGateway, GameGateway],
})
export class AppModule {}
