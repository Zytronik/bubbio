import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NewsService } from 'src/news/news.service';
import { GameStats } from 'src/game/i/game.i.game-stats';

@Injectable()
export class ScoreService {
    constructor(
        private prisma: PrismaService,
        private newsService: NewsService,
        private userService: UserService,
    ) { }

    async saveScoreToDB(userId: number, scoreStats: GameStats): Promise<any> {
        // Create Score
        const newScore = await this.createScore(userId, scoreStats);
        const scoreValue = scoreStats.gameDuration; //TODO

        // Get User by ID
        const user = await this.userService.getUserById(userId);

        // Check if the new score scores is in the top 5
        const amountOfTopScores = 5;
        const topTimes = await this.getScoreRank(amountOfTopScores);
        const rank = topTimes.findIndex(time => time.userId === newScore.userId && time.scoreValue === newScore.scoreValue) + 1;

        if (rank > 0 && rank <= amountOfTopScores && user) {
            await this.newsService.createNews('Score', userId, rank, scoreValue);
            this.newsService.updateNews();
        }

        return newScore;
    }

    async getScoreRank(take: number): Promise<any> {
        const leaderboardRecords = await this.prisma.score.findMany({
            orderBy: {
                gameDuration: 'asc', //TODO
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
    
    async createScore(userId: number, scoreStats: GameStats): Promise<any> {    
        try {
            const userExists = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                throw new Error('User does not exist');
            }
    
            return await this.prisma.score.create({
                data: {
                    userId: userId,
                    bpsGraph: JSON.stringify(scoreStats.bpsGraph),
                    bubblesCleared: scoreStats.bubblesCleared,
                    bubblesShot: scoreStats.bubblesShot,
                    bubblesPerSecond: scoreStats.bubblesPerSecond,
                    gameDuration: scoreStats.gameDuration,
                    highestBubbleClear: scoreStats.highestBubbleClear,
                    wallBounces: scoreStats.wallBounces,
                    wallBounceClears: scoreStats.wallBounceClears,
                    highestCombo: scoreStats.highestCombo,
                    bubbleClearToWin: scoreStats.bubbleClearToWin,
                    clear3: scoreStats.clear3,
                    clear4: scoreStats.clear4,
                    clear5: scoreStats.clear5,
                    clear3wb: scoreStats.clear3wb,
                    clear4wb: scoreStats.clear4wb,
                    clear5wb: scoreStats.clear5wb,
                },
            });
        } catch (error) {
            console.error('Failed to create score record due to:', error);
        }
    }
    

    async getHistory(params: { userId: number, sortBy: string, sortDirection: string, limit: number }): Promise<any> {
        const { userId, sortBy, sortDirection, limit } = params;
        const orderByField = sortBy ? sortBy : 'submittedAt';
        const isSortDirectionValid = sortDirection === 'asc' || sortDirection === 'desc';
        const orderDirection = isSortDirectionValid ? sortDirection : 'desc';

        return this.prisma.score.findMany({
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
        let records = await this.prisma.score.findMany({
            where: {
                userId: userId,
            },
            include: {
                user: true, // This includes all scalar fields of the user
            },
        });
    
        // Sort the records by gameDuration in ascending order to get the best run
        records.sort((a, b) => a.gameDuration - b.gameDuration); //TODO
    
        // Return the best run or null if there are no records
        return records.length > 0 ? records[0] : null;
    }

    async getTotalGamesPlayed(): Promise<number> {
        return this.prisma.score.count();
    }

}
