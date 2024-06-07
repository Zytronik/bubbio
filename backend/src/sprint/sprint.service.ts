import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NewsService } from 'src/news/news.service';
import { GameStats } from 'src/game/i/game.i.game-stats';

@Injectable()
export class SprintService {
    constructor(
        private prisma: PrismaService,
        private newsService: NewsService,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) { }

    async saveSprintToDB(userId: number, sprintStats: GameStats): Promise<any> {
        // Create Sprint
        const newSprint = await this.createSprint(userId, sprintStats);
        const sprintTime = sprintStats.gameDuration;

        // Get User by ID
        const user = await this.userService.getUserById(userId);

        // Check if the new sprint time is in the top 5
        const amountOfTopSprints = 5;
        const topSprints = await this.getBestSprints(amountOfTopSprints);
        const rank = topSprints.findIndex(sprint => sprint.id === newSprint.id) + 1;
        if (rank > 0 && rank <= amountOfTopSprints && user) {
            await this.newsService.createNews('Sprint', userId, rank, sprintTime);
            this.newsService.updateNews();
        }

        return newSprint;
    }

    async getBestSprints(take: number): Promise<any> {
        const leaderboardRecords = await this.prisma.sprint.findMany({
            orderBy: {
                gameDuration: 'asc',
            },
            take: take,
            distinct: ['userId'],
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });

        return leaderboardRecords;
    }

    async createSprint(userId: number, sprintStats: GameStats): Promise<any> {
        try {
            const userExists = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                throw new Error('User does not exist');
            }

            return await this.prisma.sprint.create({
                data: {
                    userId: userId,
                    bpsGraph: JSON.stringify(sprintStats.bpsGraph),
                    bubblesCleared: sprintStats.bubblesCleared,
                    bubblesShot: sprintStats.bubblesShot,
                    bubblesPerSecond: sprintStats.bubblesPerSecond,
                    gameDuration: sprintStats.gameDuration,
                    highestBubbleClear: sprintStats.highestBubbleClear,
                    wallBounces: sprintStats.wallBounces,
                    wallBounceClears: sprintStats.wallBounceClears,
                    highestCombo: sprintStats.highestCombo,
                    bubbleClearToWin: sprintStats.bubbleClearToWin,
                    clear3: sprintStats.clear3,
                    clear4: sprintStats.clear4,
                    clear5: sprintStats.clear5,
                    clear3wb: sprintStats.clear3wb,
                    clear4wb: sprintStats.clear4wb,
                    clear5wb: sprintStats.clear5wb,
                },
            });
        } catch (error) {
            console.error('Failed to create sprint due to:', error);
        }
    }


    async getHistory(params: { userId: number, sortBy: string, sortDirection: string, limit: number }): Promise<any> {
        const { userId, sortBy, sortDirection, limit } = params;
        const orderByField = sortBy ? sortBy : 'submittedAt';
        const isSortDirectionValid = sortDirection === 'asc' || sortDirection === 'desc';
        const orderDirection = isSortDirectionValid ? sortDirection : 'desc';

        return this.prisma.sprint.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                [orderByField]: orderDirection,
            },
            take: limit,
        });
    }

    async getPersonalBest(userId: number) {
        let records = await this.prisma.sprint.findMany({
            where: {
                userId: userId,
            },
            include: {
                user: true, // This includes all scalar fields of the user
            },
        });

        // Sort the records by gameDuration in ascending order to get the best run
        records.sort((a, b) => a.gameDuration - b.gameDuration);

        // Return the best run or null if there are no records
        return records.length > 0 ? records[0] : null;
    }

    async getTotalGamesPlayed(): Promise<number> {
        return this.prisma.sprint.count();
    }

    async getTotalGamesPlayedByUser(userId: number): Promise<number> {
        return this.prisma.sprint.count({
            where: {
                userId: userId,
            },
        });
    }

    async getUserGlobalRank(userId: number): Promise<number | null> {
        try {
            // Step 1: Get the user's best sprint time
            const userBestTime = await this.prisma.sprint.findFirst({
                where: { userId },
                orderBy: { gameDuration: 'asc' },
                select: { gameDuration: true }
            });

            if (!userBestTime) return null; // User has no sprint times

            // Step 2: Get the best sprint time for each user and sort them
            const allBestTimes = await this.prisma.sprint.groupBy({
                by: ['userId'],
                _min: { gameDuration: true },
                orderBy: { _min: { gameDuration: 'asc' } }
            });

            // Step 3: Find the rank of the user's best time
            const rank = allBestTimes.findIndex(time => time._min.gameDuration >= userBestTime.gameDuration) + 1;

            return rank;
        } catch (error) {
            console.error("Failed to calculate user's global sprint rank:", error);
            return null;
        }
    }

    async getUserNationalRank(userId: number): Promise<number | null> {
        try {
            // Step 1: Get the user's country
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { country: true }
            });
            if (!user) return null; // User does not exist
    
            // Step 2: Get the user's best sprint time
            const userBestTime = await this.prisma.sprint.findFirst({
                where: { userId },
                orderBy: { gameDuration: 'asc' },
                select: { gameDuration: true }
            });
    
            if (!userBestTime) return null; // User has no sprint times
    
            // Step 3: Get the best sprint time for each user in the same country
            const allBestTimesInCountry = await this.prisma.sprint.groupBy({
                by: ['userId'],
                _min: { gameDuration: true },
                where: {
                    user: {
                        country: user.country
                    }
                },
                orderBy: { _min: { gameDuration: 'asc' } }
            });
    
            // Step 4: Find the rank of the user's best time
            const rank = allBestTimesInCountry.findIndex(time => time._min.gameDuration >= userBestTime.gameDuration) + 1;
    
            return rank;
        } catch (error) {
            console.error("Failed to calculate user's national sprint rank:", error);
            return null;
        }
    }

    async getAverageStats(userId: number) {
        return await this.prisma.sprint.aggregate({
            _avg: {
                bubblesCleared: true,
                bubblesPerSecond: true,
                bubblesShot: true,
                gameDuration: true,
            },
            where: {
                userId: userId,
            },
        });
    }

    async getSprint(sprintId: string) {
        return await this.prisma.sprint.findUnique({
            where: {
                id: parseInt(sprintId),
            },
        });
    }
}
