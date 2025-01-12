import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { UsersModule } from 'src/user/user.module';
import { FriendsController } from './friends.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    exports: [FriendsService],
    imports: [UsersModule, PrismaModule],
    controllers: [FriendsController],
    providers: [FriendsService],
})
export class FriendsModule { }
