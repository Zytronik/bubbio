import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileStorageService } from './fileStorage.service';

@Module({
    imports: [],
    providers: [UserService, PrismaService, FileStorageService],
    controllers: [UserController],
    exports: [UserService]
})
export class UsersModule { }
