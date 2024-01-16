import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/auth.dto.createUser';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto): Promise<any> {
        // Create user logic
    }

    async findOne(id: number): Promise<any> {
        // Find user logic
    }
}
