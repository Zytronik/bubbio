import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModDetail } from './leaderboard.i.mods';

@Injectable()
export class LeaderboardService {
    constructor(
        private prisma: PrismaService,
    ) { }
    getPrismaModelForGameMode(gameMode: string) {
        switch (gameMode) {
            case "sprint":
                return this.prisma.sprint;
            default:
                throw new Error(`Unsupported game mode: ${gameMode}`);
        }
    }

    async getLeaderboardData(criteria: {
        gameMode: string;
        sortBy: string;
        sortDirection: string;
        category: string;
        country: string;
        mods: ModDetail[];
        limit: number;
    }) {
        const prismaModel = this.getPrismaModelForGameMode(criteria.gameMode);

        let whereClause: Record<string, unknown> = {};

        if (criteria.category === 'national' && criteria.country) {
            whereClause = {
                ...whereClause,
                user: {
                    country: criteria.country,
                },
            };
        }

        // Extract toggle mods that are enabled
        const enabledToggleMods = criteria.mods
            .filter(mod => mod.type === 'toggle')
            .map(mod => mod.abr);

        // Fetch records, including user data
        let records = await prismaModel.findMany({
            where: whereClause,
            include: {
                user: true, // This automatically selects all scalar fields of the user
            },
        });

        // Filter by enabled toggle mods and ensure grouping by userId to select the best run
        let bestRunsPerUser = records.reduce((acc, record) => {
            try {
                const recordMods = record.mods ? JSON.parse(record.mods) : [];
                // Determine if the record matches the selected mods
                const modsMatch = enabledToggleMods.length === 0 ?
                    recordMods.every(mod => mod.type !== 'toggle') : // If no mods are selected, match records with no toggle mods
                    enabledToggleMods.length === recordMods.filter(mod => mod.type === 'toggle').length && // The number of toggle mods in the record matches the selected mods
                    enabledToggleMods.every(mod => recordMods.some(rMod => rMod.abr === mod)); // Every selected mod is present in the record

                if (modsMatch) {
                    const currentBest = acc[record.userId];
                    const isBetterRun = !currentBest || (criteria.sortDirection === 'asc' ? record[criteria.sortBy] < currentBest[criteria.sortBy] : record[criteria.sortBy] > currentBest[criteria.sortBy]);
                    if (isBetterRun) {
                        acc[record.userId] = record;
                    }
                }
            } catch (error) {
                console.error("Error parsing mods for record:", record, error);
            }
            return acc;
        }, {});

        // Convert the records object back to an array of best runs
        let filteredRecords = Object.values(bestRunsPerUser);

        // Sort the filtered records by sortBy and sortDirection
        filteredRecords.sort((a, b) => {
            return criteria.sortDirection === 'asc' ? a[criteria.sortBy] - b[criteria.sortBy] : b[criteria.sortBy] - a[criteria.sortBy];
        });

        // Limit the results
        filteredRecords = filteredRecords.slice(0, criteria.limit);

        return filteredRecords;
    }

}