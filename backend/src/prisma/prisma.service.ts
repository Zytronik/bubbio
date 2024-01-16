import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    async findUserByUsername(username: string) {
        return this.user.findUnique({
            where: { username },
        });
    }
}
