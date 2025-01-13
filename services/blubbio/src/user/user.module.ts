import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileStorageService } from './file-storage.service';
import { RankedModule } from 'src/ranked/ranked.module';
import { FriendsModule } from 'src/friends/friends.module';
import { SprintModule } from 'src/sprint/sprint.module';

@Module({
    imports: [forwardRef(() => RankedModule), forwardRef(() => SprintModule)],
    providers: [UserService, PrismaService, FileStorageService],
    controllers: [UserController],
    exports: [UserService]
})
export class UsersModule { }
