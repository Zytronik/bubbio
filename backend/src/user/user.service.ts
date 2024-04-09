import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/auth.dto.create-user';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { RanksService } from 'src/ranked/ranks.service';
import { FileStorageService } from './file-storage.service';
import { Ratings } from 'src/ranked/i/ranked.i.ratings';
import { Prisma } from '@prisma/client';
import { unrankedRatingDeviation } from 'src/ranked/ranks';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => RanksService))
        private ranksService: RanksService,
        private fileStorageService: FileStorageService,
    ) { }

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
            throw new BadRequestException({
                message: ['Username already taken'],
                error: 'Bad Request',
                statusCode: 400,
            });
        }

        // Check if a user with the given email already exists
        const existingEmail = await this.emailExists(createUserDto.email);
        if (existingEmail) {
            throw new BadRequestException({
                message: ['Email already taken'],
                error: 'Bad Request',
                statusCode: 400,
            });
        }

        // If no existing user, proceed with creating a new user
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                username: createUserDto.username,
                email: createUserDto.email,
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

    async emailExists(email: string): Promise<boolean> {
        if (!email || email.trim() === '') {
            return false;
        }

        const user = await this.prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
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

    async getUsernameById(userId: number): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { username: true },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user.username;
    }

    async getUserSprintRank(username: string): Promise<number | null> {
        // Step 1: Get the user's best sprint time
        const userBestTimeRecord = await this.prisma.sprint.findFirst({
            where: {
                user: {
                    username: {
                        equals: username,
                        mode: 'insensitive',
                    }
                }
            },
            orderBy: { gameDuration: 'asc' },
            select: { gameDuration: true },
        });

        if (!userBestTimeRecord) {
            return null; // User has no sprint times
        }

        // Step 2: Get the best sprint time for each user and sort them
        const bestTimes = await this.prisma.sprint.groupBy({
            by: ['userId'],
            _min: {
                gameDuration: true,
            },
            orderBy: {
                _min: {
                    gameDuration: 'asc',
                },
            },
        });

        // Find the rank of the user's best time among these best times
        // We count how many times have a better (lower) sprintTime than the user's best time
        const rank = bestTimes.findIndex(time => time._min.gameDuration >= userBestTimeRecord.gameDuration) + 1;

        return rank;
    }

    async getUserProfileByUsername(username: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                username: true,
                createdAt: true,
                countryCode: true,
                country: true,
                pbUrl: true,
                bannerUrl: true,
                LastDisconnectedAt: true,
                ratingDeviation: true,
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
                gameDuration: true,
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
        let rankInfos = await this.ranksService.getRankInfo(user.id);
        if (user.ratingDeviation >= unrankedRatingDeviation) {
            rankInfos.isRanked = false;
        }

        return {
            ...user,
            rankIcon: rankInfos.iconName,
            rankName: rankInfos.name,
            isRanked: rankInfos.isRanked,
            sprintStats: {
                averageBubblesCleared: sprintStats._avg.bubblesCleared,
                averageBubblesPerSecond: sprintStats._avg.bubblesPerSecond,
                averageBubblesShot: sprintStats._avg.bubblesShot,
                averageSprintTime: sprintStats._avg.gameDuration,
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
                countryCode: true,
                country: true,
                // Specify any other fields you want to include here
            },
        });
    }

    async getTotalRegisteredUsersCount(): Promise<number> {
        return await this.prisma.user.count();
    }

    async updateProfileImgs(userId: number, file: Express.Multer.File, imgType: "pb" | "banner"): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const fieldToUpdate = imgType === "pb" ? "pbUrl" : "bannerUrl";
        const oldFilename = user[fieldToUpdate];

        // Upload the new file to DigitalOcean Spaces and get the URL
        const fileUrl = await this.fileStorageService.uploadFile(file, imgType);

        // Update the database with the new file URL
        await this.prisma.user.update({
            where: { id: userId },
            data: { [fieldToUpdate]: fileUrl },
        });

        // Delete the old file from DigitalOcean Spaces if it's different from the new one
        if (oldFilename && oldFilename !== fileUrl) {
            await this.fileStorageService.deleteFile(oldFilename, imgType);
        }
    }

    async updateLastDisconnectedAt(username: string): Promise<void> {
        await this.prisma.user.update({
            where: { username },
            data: { LastDisconnectedAt: new Date() },
        });
    }

    async getUserById(userId: number): Promise<any> {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                username: true,
            },
        });
    }

    async updateUserInputSettings(userId: number, inputSettings: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { inputSettings },
        });
    }

    async getInputSettings(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { inputSettings: true },
        });
        return user?.inputSettings;
    }

    async getUserCountry(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { country: true },
        });
        return user?.country;
    }

    async findByEmail(email: string): Promise<any | null> {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async getProbableGlobalRank(userId: number): Promise<number> {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    OR: [
                        { ratingDeviation: { lte: unrankedRatingDeviation - 1 } },
                        { id: userId } // Ensure the specified user is always included
                    ]
                },
                select: {
                    id: true,
                    rating: true, // Needed for ordering
                    ratingDeviation: true, // Needed for ordering
                    username: true, // Needed for ordering
                },
                orderBy: [
                    { rating: 'desc' },
                    { ratingDeviation: 'asc' },
                    { username: 'asc' },
                ],
            });

            // Calculate rank based on position in sorted list
            const userIndex = users.findIndex(user => user.id === userId);
            if (userIndex === -1) {
                return null; // User not found in the list, which shouldn't happen but good to handle
            }
            return userIndex + 1; // Adjusting for zero-based index to get the rank
        } catch (error) {
            console.error('Error getting global rank:', error);
            return null;
        }
    }

    async getGlobalRank(userId: number): Promise<number> {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    ratingDeviation: {
                        lte: unrankedRatingDeviation - 1,
                    }
                },
                select: {
                    id: true,
                },
                orderBy: [
                    {
                        rating: 'desc',
                    },
                    {
                        ratingDeviation: 'asc',
                    },
                    {
                        username: 'asc',
                    },
                ]
            });
            const userIndex = users.findIndex(user => user.id === userId);
            return userIndex + 1;
        } catch (error) {
            console.error('Error getting global rank.');
            return null;
        }
    }

    async getGlobalRanks(userIds: number[]): Promise<{ [userId: number]: number }> {
        try {
            // Fetch the sorted list of all users by their ranking criteria
            const users = await this.prisma.user.findMany({
                where: {
                    ratingDeviation: {
                        lte: unrankedRatingDeviation - 1,
                    }
                },
                orderBy: [
                    { rating: 'desc' },
                    { ratingDeviation: 'asc' },
                    { username: 'asc' },
                ],
                select: { id: true, rating: true, ratingDeviation: true } // Select only necessary fields
            });

            // Convert the sorted list into a map for faster lookup
            const rankMap = new Map(users.map((user, index) => [user.id, index + 1]));

            // Create a result object to store the rank of each requested userId
            const ranks = {};
            userIds.forEach(userId => {
                ranks[userId] = rankMap.get(userId) || null; // Use null or appropriate value for users not found
            });
            return ranks;
        } catch (error) {
            console.error('Error getting global ranks:', error);
            throw error; // Rethrow or handle as needed
        }
    }

    async getNationalRank(userId: number): Promise<number> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    countryCode: true,
                },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const users = await this.prisma.user.findMany({
                where: {
                    countryCode: user.countryCode,
                    ratingDeviation: {
                        lte: unrankedRatingDeviation - 1,
                    },
                },
                orderBy: [
                    {
                        rating: 'desc',
                    },
                    {
                        ratingDeviation: 'asc',
                    },
                    {
                        username: 'asc',
                    },
                ],
            });

            const userIndex = users.findIndex(user => user.id === userId);

            return userIndex + 1;
        } catch (error) {
            console.error('Error getting national rank:', error);
            return null;
        }
    }

    async getTotalNumberOfRegisteredUsers(): Promise<number | null> {
        try {
            const count = await this.prisma.user.count();
            return count;
        } catch (error) {
            console.error('Error retrieving total number of registered users.');
            return null;
        }
    }

    async getNumberOfRankedPlayers(): Promise<number | null> {
        try {
            const count = await this.prisma.user.count({
                where: {
                    ratingDeviation: {
                        lte: unrankedRatingDeviation - 1,
                    }
                }
            });
            return count;
        } catch (error) {
            console.error('Error retrieving number of ranked players.');
            return null;
        }
    }

    async getProbablyAroundPercentile(userId: number): Promise<number> {
        const probablyRank = await this.getProbableGlobalRank(userId);
        const totalUsersAndMe = await this.getNumberOfRankedPlayers() + 1;
        return Math.round((probablyRank / totalUsersAndMe * 100 + Number.EPSILON) * 100) / 100;
    }

    async getPercentile(userId: number): Promise<number> {
        const rank = await this.getGlobalRank(userId);
        const totalUsers = await this.getNumberOfRankedPlayers();
        return Math.round((rank / totalUsers * 100 + Number.EPSILON) * 100) / 100;
    }

    async getPercentiles(userIds: number[]): Promise<{ [userId: number]: number }> {
        const userRanks = await this.getGlobalRanks(userIds);
        const rankedUsers = await this.getNumberOfRankedPlayers();
        const percentiles = {};
        userIds.forEach(userId => {
            const rank = userRanks[userId];
            const percentile = Math.round((rank / rankedUsers * 100 + Number.EPSILON) * 100) / 100;
            percentiles[userId] = percentile;
        });
        return percentiles;
    }

    async getMatchmakingStats(userId: number): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                rating: true,
                ratingDeviation: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        let globalRank = null;
        let nationalRank = null;
        let percentile = null;

        let rankInfo = await this.ranksService.getRankInfo(userId);
        if (user.ratingDeviation >= unrankedRatingDeviation) {
            const probablyAroundRank = await this.ranksService.getProbablyAroundRank(userId);
            rankInfo = probablyAroundRank;
            rankInfo.isRanked = false;
        } else {
            globalRank = await this.getGlobalRank(userId);
            nationalRank = await this.getNationalRank(userId);
            percentile = await this.getPercentile(userId);
        }

        return {
            userId,
            rating: Math.round(user.rating),
            ratingDeviation: Math.round(user.ratingDeviation),
            globalRank: globalRank,
            nationalRank: nationalRank,
            gamesWon: 0,
            gamesCount: 0,
            percentile: percentile,
            rankInfo: rankInfo,
        };
    }

    async getGlickoRatingsByUserId(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                rating: true,
                ratingDeviation: true,
                volatility: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    updateGlickoRating(winnerID: number, winnerRatings: Ratings, loserID: number, loserRatings: Ratings): Promise<any> {
        return this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: winnerID },
                data: {
                    rating: winnerRatings.rating,
                    ratingDeviation: winnerRatings.ratingDeviation,
                    volatility: winnerRatings.volatility,
                },
            }),
            this.prisma.user.update({
                where: { id: loserID },
                data: {
                    rating: loserRatings.rating,
                    ratingDeviation: loserRatings.ratingDeviation,
                    volatility: loserRatings.volatility,
                },
            }),
        ]);
    }
}