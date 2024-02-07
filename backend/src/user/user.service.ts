import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/auth.dto.createUser';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import axios from 'axios';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser(createUserDto: CreateUserDto, clientIp: string): Promise<any> {
        // Fetch the country code using the client's IP address
        let countryCode = '';
        console.log("createrUser");
        try {
            const { data } = await axios.get(`http://ip-api.com/json/${clientIp}`);
            console.log(data);
            countryCode = data.countryCode;
        } catch (error) {
            console.log("ijuedsnrgoiujnserigjuonwerg");
            console.error('Failed to fetch country code:', error);
        }

        // Check if a user with the given username already exists
        const existingUser = await this.userExists(createUserDto.username);
        if (existingUser) {
            throw new BadRequestException('username already exists');
        }

        // If no existing user, proceed with creating a new user
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                username: createUserDto.username,
                password: hashedPassword,
                countryCode,
            },
        });

        delete user.password;
        return user;
    }

    async userExists(username: string): Promise<boolean> {
        if (!username || username.trim() === '') {
            return false;
        }

        const user = await this.prisma.user.findUnique({
            where: { username },
        });
        return !!user;
    }

    async getUserByUsername(username: string): Promise<any> {
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


    async getUserProfileByUsername(username: string): Promise<any> {
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

    async searchUsers(query: string) {
        return this.prisma.user.findMany({
            where: {
                username: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            take: 5, // Limit the results to the top 5 matches
            select: {
                id: true,
                username: true,
                // Specify any other fields you want to include here
            },
        });
    }

    async getTotalRegisteredUsersCount(): Promise<number> {
        return await this.prisma.user.count();
    }
}