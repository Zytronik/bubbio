import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
        mods: string[];
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
    
        // Fetch records, including user data
        let records = await prismaModel.findMany({
            where: whereClause,
            include: {
                user: true, // This automatically selects all scalar fields of the user
            },
        });
    
        // Filter by mods and ensure grouping by userId to select the best run
        let bestRunsPerUser = records.reduce((acc, record) => {
            try {
                const recordMods = record.mods ? JSON.parse(record.mods) : [];
                const modsMatch = criteria.mods.length === 0 ? recordMods.length === 0 : criteria.mods.sort().join(',') === recordMods.sort().join(',');
    
                // Proceed if mods criteria match
                if (modsMatch) {
                    const currentBest = acc[record.userId];
                    const isBetterRun = !currentBest || (criteria.sortDirection === 'asc' ? record[criteria.sortBy] < currentBest[criteria.sortBy] : record[criteria.sortBy] > currentBest[criteria.sortBy]);
    
                    if (isBetterRun) {
                        acc[record.userId] = record;
                    }
                }
            } catch (error) {
               // console.error("Error parsing mods for record:", record, error);
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