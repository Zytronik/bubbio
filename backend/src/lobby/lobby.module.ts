import { Module } from '@nestjs/common';
import { LobbyGateway } from './lobby.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/user/user.module';

@Module({
    imports: [JwtModule, UsersModule],
    providers: [LobbyGateway],
    exports: [LobbyGateway],
})
export class LobbyModule { }
