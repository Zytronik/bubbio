import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NewsService } from 'src/news/news.service';
import { GameStatsDto } from './dto/dto.game-stats';

@Injectable()
export class SprintService {
    constructor(
        private prisma: PrismaService,
        private newsService: NewsService,
        private userService: UserService,
    ) { }

    async saveGameStats(userId: number, gameStatsDto: any): Promise<any> {
        // Create Sprint
        const newSprint = await this.createSprint(userId, gameStatsDto);
        const sprintTime = gameStatsDto.sprintTime;

        // Get User by ID
        const user = await this.userService.getUserById(userId);

        // Check if the new sprint time is in the top 5
        const topTimes = await this.getLeaderboard();
        const rank = topTimes.findIndex(time => time.userId === newSprint.userId && time.sprintTime === newSprint.sprintTime) + 1;

        if (rank > 0 && rank <= 5 && user) {
            await this.newsService.createNews('Sprint', userId, rank, sprintTime);
            this.newsService.updateNews();
        }

        return newSprint;
    }

    async createSprint(userId: number, gameStatsDto: GameStatsDto): Promise<any> {
        try {
            return await this.prisma.sprint.create({
                data: {
                    userId: userId,
                    ...gameStatsDto,
                },
            });
        } catch (error) {
            throw new Error('Unable to create sprint record.');
        }
    }

    async getLeaderboard(): Promise<any> {
        // Find the best sprintTime for each user
        const bestTimes = await this.prisma.sprint.findMany({
            select: {
                userId: true,
                sprintTime: true,
            },
            orderBy: {
                sprintTime: 'asc',
            },
            distinct: ['userId'],
        });

        // Fetch the corresponding sprint records for these best times
        const leaderboardRecords = await Promise.all(
            bestTimes.map(async (time) => {
                return this.prisma.sprint.findFirst({
                    where: {
                        userId: time.userId,
                        sprintTime: time.sprintTime,
                    },
                    include: {
                        user: {
                            select: {
                                username: true,
                            },
                        },
                    },
                });
            })
        );

        return leaderboardRecords.filter(record => record !== null);
    }


    async getUserHistory(userId: number): Promise<any> {
        return this.prisma.sprint.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                submittedAt: 'desc',
            },
            take: 15,
        });
    }
    

    async getPersonalBests(userId: number): Promise<any> {
        return this.prisma.sprint.findMany({
            where: {
                userId: userId,
            },
            orderBy: [
                {
                    sprintTime: 'asc',
                },
            ],
            take: 3,
        });
    }

    async getTotalGamesPlayed(): Promise<number> {
        return this.prisma.sprint.count();
    }

}
