import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SprintService {
    constructor(private prisma: PrismaService) { }

    async saveGameStats(userId: number, gameStatsDto: any): Promise<any> {
        return this.prisma.sprint.create({
            data: {
                userId: userId,
                ...gameStatsDto,
            },
        });
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
