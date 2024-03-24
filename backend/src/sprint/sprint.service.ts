import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NewsService } from 'src/news/news.service';
import { SprintStatsDto, SubmitSprintDto } from './dto/dto.submit-sprint-dto';
import { ModDetail } from 'src/leaderboard/leaderboard.i.mods';

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

    getEnabledSprintMods(sprintModsDto: string) {
        const mods = JSON.parse(sprintModsDto);
        const filteredMods = mods.filter(mod => mod.type !== 'toggle' || mod.enabled);
        const enabledMods = filteredMods.map(mod => {
            return { abr: mod.abr, type: mod.type };
        });

        return enabledMods;
    }

    async getSpintPB(mods: string[]) {
        return await this.prisma.sprint.findMany({
            where: {
                mods: JSON.stringify(mods)
            },
            orderBy: {
                gameDuration: 'asc'
            },
            take: 1
        })
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

    async getPersonalBest(userId: number, mods: ModDetail[] | string): Promise<any> {
        // Initialize modsArray to ensure it's always an array
        let modsArray: ModDetail[];

        // Check if mods is a string (JSON) and parse it if so
        if (typeof mods === 'string') {
            try {
                modsArray = JSON.parse(mods);
            } catch (error) {
                console.error('Error parsing mods JSON:', error);
                return null; // Or handle the error as appropriate
            }
        } else {
            // If mods is already an array, use it directly
            modsArray = mods;
        }

        const enabledToggleMods = modsArray
            .filter(mod => mod.type === 'toggle')
            .map(mod => mod.abr);

        // Fetch runs for the user
        let records = await this.prisma.sprint.findMany({
            where: {
                userId: userId,
            },
            include: {
                user: true, // This includes all scalar fields of the user
            },
        });

        // Filter records based on mods criteria
        const filteredRecords = records.filter(record => {
            try {
                const recordMods = record.mods ? JSON.parse(record.mods) : [];
                // Determine if the record matches the selected mods
                const modsMatch = enabledToggleMods.length === 0 ?
                    recordMods.every(mod => mod.type !== 'toggle') : // If no mods are selected, match records with no toggle mods
                    enabledToggleMods.length === recordMods.filter(mod => mod.type === 'toggle').length && // The number of toggle mods in the record matches the selected mods
                    enabledToggleMods.every(mod => recordMods.some(rMod => rMod.abr === mod)); // Every selected mod is present in the record

                return modsMatch;
            } catch (error) {
                console.error("Error parsing mods for record:", record, error);
                return false;
            }
        });

        // Sort the filtered records by gameDuration in ascending order to get the best run
        filteredRecords.sort((a, b) => a.gameDuration - b.gameDuration);

        // Return the best run or null if there are no matching records
        return filteredRecords.length > 0 ? filteredRecords[0] : null;
    }


    async getTotalGamesPlayed(): Promise<number> {
        return this.prisma.sprint.count();
    }

}
