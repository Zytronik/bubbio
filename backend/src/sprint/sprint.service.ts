import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NewsService } from 'src/news/news.service';
import { GameStats } from 'src/game/i/game.i.game-stats';
import { NewsGateway } from 'src/news/news.gateway';
import { GameInstance } from 'src/game/i/game.i.game-instance';
import { GameStateHistory, compressReplayData } from 'src/game/i/game.i.game-state-history';

@Injectable()
export class SprintService {
    private werkschauPlayer1ID: number = 1; //46
    private werkschauPlayer2ID: number = 2; //47

    constructor(
        private prisma: PrismaService,
        private newsGateway: NewsGateway,
        private newsService: NewsService,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        
    ) { }

    async saveSprintToDB(userId: number, gameInstance: GameInstance): Promise<any> {
        // Create Sprint
        const newSprint = await this.createSprint(userId, gameInstance);
        const sprintTime = gameInstance.stats.gameDuration;

        // Get User by ID
        const user = await this.userService.getUserById(userId);

        //werkschau only
        if (userId === this.werkschauPlayer1ID || userId === this.werkschauPlayer2ID) {
            this.updateWerkschauLeaderboard(newSprint.id);
        }

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

    async createSprint(userId: number, gameInstance: GameInstance): Promise<any> {
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
                    bpsGraph: JSON.stringify(gameInstance.stats.bpsGraph),
                    bubblesCleared: gameInstance.stats.bubblesCleared,
                    bubblesShot: gameInstance.stats.bubblesShot,
                    bubblesPerSecond: gameInstance.stats.bubblesPerSecond,
                    gameDuration: gameInstance.stats.gameDuration,
                    highestBubbleClear: gameInstance.stats.highestBubbleClear,
                    wallBounces: gameInstance.stats.wallBounces,
                    wallBounceClears: gameInstance.stats.wallBounceClears,
                    highestCombo: gameInstance.stats.highestCombo,
                    bubbleClearToWin: gameInstance.stats.bubbleClearToWin,
                    clear3: gameInstance.stats.clear3,
                    clear4: gameInstance.stats.clear4,
                    clear5: gameInstance.stats.clear5,
                    clear3wb: gameInstance.stats.clear3wb,
                    clear4wb: gameInstance.stats.clear4wb,
                    clear5wb: gameInstance.stats.clear5wb,
                    gameStateHistory: JSON.stringify(compressReplayData(gameInstance.gameStateHistory)),
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

    async getTotalSprintDuration() {
        const totalSprintDuration = await this.prisma.sprint.aggregate({
            _sum: {
                gameDuration: true,
            },
        });
        return totalSprintDuration._sum.gameDuration;
    }

    async getTotalRankedDuration(): Promise<number> {
        // Fetch all ranked games from the database
        const rankedGames = await this.prisma.ranked.findMany();
    
        // Calculate the total duration
        let totalDuration = 0;
        for (const game of rankedGames) {
            const user1Stats: GameStats = JSON.parse(game.user1Stats);
            const user2Stats: GameStats = JSON.parse(game.user2Stats);
            if(user1Stats[0] && user2Stats[0]){
                totalDuration += user1Stats[0].gameDuration;
                totalDuration += user2Stats[0].gameDuration;
            }
        }
        
        return totalDuration;
    }

    async getGlobalStats(){
        const totalSprintDuration = await this.getTotalSprintDuration();
        const totalRankedDuration = await this.getTotalRankedDuration();
        const totalPlayTime = Math.round((totalSprintDuration + totalRankedDuration) / 1000 / 60 / 60);
        const totalGames = await this.getTotalGamesPlayed();
        return {totalPlayTime, totalGames};
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
        if(!sprintId) {
            throw new Error('No sprint ID provided');
        }
        return await this.prisma.sprint.findUnique({
            where: {
                id: parseInt(sprintId),
            },
        });
    }

    async getWerkschauLeaderboard() {
        const leaderboardRecords = await this.prisma.sprint.findMany({
            where: {
                userId: {
                    in: [this.werkschauPlayer1ID, this.werkschauPlayer2ID],
                },
            },
            orderBy: {
                gameDuration: 'asc',
            },
            take: 100,
            select: {
                id: true,
                userId: true,
                gameDuration: true,
                submittedAt: true,
                bubblesCleared: true,
                bubblesShot: true,
                bubblesPerSecond: true,
                highestBubbleClear: true,
                user: {
                    select: {
                        username: true,
                        pbUrl: true,
                    },
                },
            },
        });
        return leaderboardRecords;
    }

    async updateWerkschauLeaderboard(currentSprintId: number) {
        const leaderboard = await this.getWerkschauLeaderboard();
        this.newsGateway.server.emit('newWerkschauRecord', { leaderboard, currentSprintId});
    }
}
