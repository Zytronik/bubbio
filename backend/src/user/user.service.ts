import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/auth.dto.createUser';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto): Promise<any> {
        // Check if a user with the given username already exists
        const existingUser = await this.userExists(createUserDto.username);
        if (existingUser) {
            throw new BadRequestException({
                message: ['username already exists'],
                error: 'Bad Request',
                statusCode: 400,
            });
        }

        // If no existing user, proceed with creating a new user
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                username: createUserDto.username,
                password: hashedPassword,
            },
        });

        delete user.password; // Remove password from the response
        return user;
    }

    async userExists(username: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });
        return !!user;
    }

    async findByUsername(username: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new BadRequestException({
                message: [`user with username ${username} not found`],
                error: 'Bad Request',
                statusCode: 400,
            });
        }

        return user;
    }


    async findProfileByUsername(username: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { username },
            select: {
                username: true,
                createdAt: true,
                // Add other fields you want to return
            },
        });

        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        return user;
    }

}
