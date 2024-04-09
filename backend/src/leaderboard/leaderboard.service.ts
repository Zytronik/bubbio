import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModDetail } from './i/leaderboard.i.mod-detail';
import { RanksService } from 'src/ranked/ranks.service';
import { unrankedRatingDeviation } from 'src/ranked/ranks';

@Injectable()
export class LeaderboardService {
    constructor(
        private prisma: PrismaService,
        private ranksService: RanksService,
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
        if (criteria.gameMode === "ranked") {
            return this.getRankedLeaderboard(criteria.category, criteria.country, criteria.limit);
        }
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
                user: {
                    select: {
                        username: true,
                        pbUrl: true,
                    }
                },
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

    async getRankedLeaderboard(category: string, country: string, limit: number) {
        let whereClause: Record<string, any> = {
            ratingDeviation: {
                lte: unrankedRatingDeviation - 1,
            }
        };

        if (category === 'national' && country) {
            whereClause.country = country;
        }

        let queryOptions = {
            where: whereClause,
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
            take: limit,
            select: {
                username: true,
                rating: true,
                pbUrl: true,
                id: true,
            }
        };

        try {
            const leaderboardRecords = await this.prisma.user.findMany(queryOptions as unknown);

            const formattedLeaderboard = await Promise.all(leaderboardRecords.map(async (record) => {
                /* const rankName = (await this.ranksService.getRankInfo(record.id)).ascii; */

                return {
                    user: {
                        username: record.username,
                        pbUrl: record.pbUrl,
                    },
                    userId: record.id,
                    /* rank: rankName, */
                    rating: `${Math.round(record.rating)} Elo`,
                };
            }));
            const ranksOfUsers = await this.ranksService.getRanksOfUsers(formattedLeaderboard.map(record => record.userId));

            const leaderboardWithRanks = formattedLeaderboard.map(leaderboardEntry => {
                const userRankInfo = ranksOfUsers[leaderboardEntry.userId];
                return {
                    ...leaderboardEntry,
                    rank: userRankInfo ? userRankInfo.ascii : 'Unknown',
                };
            });
            return leaderboardWithRanks;

        } catch (error) {
            console.error("Failed to fetch ranked leaderboard data.");
        }
    }




}