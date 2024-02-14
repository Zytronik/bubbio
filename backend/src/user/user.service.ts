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
        let country = '';
        try {
            const { data } = await axios.get(`http://ip-api.com/json/${clientIp}`);
            countryCode = data.countryCode;
            country = data.country;
        } catch (error) {
            console.error('Failed to fetch ip api data:', error);
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
                country,
            },
        });

        delete user.password;
        return user;
    }

    async userExists(username: string): Promise<boolean> {
        if (!username || username.trim() === '') {
            return false;
        }

        const user = await this.prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive',
                },
            },
        });
        return !!user;
    }

    async getUserByUsername(username: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive',
                },
            },
        });

        if (!user) {
            throw new BadRequestException({
                message: [`User with Username ${username} not found`],
                error: 'Bad Request',
                statusCode: 400,
            });
        }

        return user;
    }

    async getUserSprintRank(username: string): Promise<number | null> {
        // Step 1: Get the user's best sprint time
        const userBestTimeRecord = await this.prisma.sprint.findFirst({
            where: { user: { username: username } },
            orderBy: { sprintTime: 'asc' },
            select: { sprintTime: true },
        });
    
        if (!userBestTimeRecord) {
            return null; // User has no sprint times
        }
    
        // Step 2: Get the best sprint time for each user and sort them
        const bestTimes = await this.prisma.sprint.groupBy({
            by: ['userId'],
            _min: {
                sprintTime: true,
            },
            orderBy: {
                _min: {
                    sprintTime: 'asc',
                },
            },
        });
    
        // Find the rank of the user's best time among these best times
        // We count how many times have a better (lower) sprintTime than the user's best time
        const rank = bestTimes.findIndex(time => time._min.sprintTime >= userBestTimeRecord.sprintTime) + 1;
    
        return rank;
    }

    async getUserProfileByUsername(username: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                createdAt: true,
                countryCode: true,
                country: true,
                pbUrl: true,
                bannerUrl: true,
            },
        });
    
        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }
    
        // Fetch average sprint statistics for this user
        const sprintStats = await this.prisma.sprint.aggregate({
            _avg: {
                bubblesCleared: true,
                bubblesPerSecond: true,
                bubblesShot: true,
                sprintTime: true,
            },
            where: {
                userId: user.id,
            },
        });

        const sprintGamesPlayed = await this.prisma.sprint.count({
            where: {
                userId: user.id,
            },
        });

        const sprintRank = await this.getUserSprintRank(username);

        return {
            ...user,
            sprintStats: {
                averageBubblesCleared: sprintStats._avg.bubblesCleared,
                averageBubblesPerSecond: sprintStats._avg.bubblesPerSecond,
                averageBubblesShot: sprintStats._avg.bubblesShot,
                averageSprintTime: sprintStats._avg.sprintTime,
                sprintGamesPlayed: sprintGamesPlayed,
                rank: sprintRank,
            },
        };
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