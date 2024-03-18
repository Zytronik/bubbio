import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NewsService } from 'src/news/news.service';
import { SprintStatsDto, SubmitSprintDto } from './dto/dto.submit-sprint-dto';

@Injectable()
export class SprintService {
    constructor(
        private prisma: PrismaService,
        private newsService: NewsService,
        private userService: UserService,
    ) { }

    async saveGameStats(userId: number, submitSprintDto: SubmitSprintDto): Promise<any> {
        // Create Sprint
        const sprintMods: string[] = this.getEnabledSprintMods(submitSprintDto.mods);
        const newSprint = await this.createSprint(userId, submitSprintDto.submitStats, sprintMods);
        const sprintTime = submitSprintDto.submitStats.gameDuration;

        // Get User by ID
        const user = await this.userService.getUserById(userId);

        // Check if the new sprint time is in the top 5
        const amountOfTopSprints = 5;
        const topTimes = await this.getSprintRank(amountOfTopSprints);
        const rank = topTimes.findIndex(time => time.userId === newSprint.userId && time.sprintTime === newSprint.sprintTime) + 1;

        if (rank > 0 && rank <= amountOfTopSprints && user) {
            await this.newsService.createNews('Sprint', sprintMods, userId, rank, sprintTime);
            this.newsService.updateNews();
        }

        return newSprint;
    }

    getEnabledSprintMods(sprintModsDto: string): string[] {
        const mods = JSON.parse(sprintModsDto);
        return Object.keys(mods).filter(mod => mods[mod]);
    }

    async getSprintRank(take: number): Promise<any> {
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

    async createSprint(userId: number, sprintStatsDto: SprintStatsDto, sprintMods: string[]): Promise<any> {
        try {
            return await this.prisma.sprint.create({
                data: {
                    userId: userId,
                    ...sprintStatsDto,
                    mods: JSON.stringify(sprintMods),
                },
            });
        } catch (error) {
            throw new Error('Unable to create sprint record.');
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

    async getPersonalBest(userId: number): Promise<any> {
        return this.prisma.sprint.findMany({
            where: {
                userId: userId,
            },
            orderBy: [
                {
                    gameDuration: 'asc',
                },
            ],
            take: 1,
        });
    }

    async getTotalGamesPlayed(): Promise<number> {
        return this.prisma.sprint.count();
    }

}
