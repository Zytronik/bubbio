import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt/auth.jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthGuard } from './jwt/auth.jwt.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokensCleanupService } from './auth.tokens-cleanup-service';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXI') }, 
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, TokensCleanupService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, UsersModule],
})
export class AuthModule {}
