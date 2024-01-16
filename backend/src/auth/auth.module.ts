import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt/auth.jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        UsersModule,
        PrismaModule,
        PassportModule,
    ],
    providers: [AuthService, JwtStrategy, JwtService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
