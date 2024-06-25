import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RanksService } from 'src/ranked/ranks.service';
import { unrankedRatingDeviation } from 'src/ranked/ranks';

@Injectable()
export class LeaderboardService {
    constructor(
        private prisma: PrismaService,
        private ranksService: RanksService,
    ) { }

    async getLeaderboardData(criteria: {
        gameMode: string;
        sortBy: string;
        sortDirection: string;
        category: string;
        country: string;
        limit: number;
    }) {
        let records;
        switch (criteria.gameMode) {
            case "sprint":
                records = await this.prisma.sprint.findMany(this.createQuery(criteria));
                break;
            case "score":
                records = await this.prisma.score.findMany(this.createQuery(criteria));
                break;
            case "ranked":
                return this.getRankedLeaderboard(criteria.category, criteria.country, criteria.limit);
            default:
                throw new Error(`Unsupported game mode: ${criteria.gameMode}`);
        }

        return this.processRecords(records, criteria);
    }

    createQuery(criteria: {
        category: string;
        country: string;
        sortBy: string;
        sortDirection: string;
    }) {
        let whereClause = {};
        if (criteria.category === 'national' && criteria.country) {
            whereClause = {
                user: {
                    country: criteria.country,
                },
            };
        }

        return {
            where: whereClause,
            select: {
                bubblesPerSecond: true,
                id: true,
                userId: true,
                submittedAt: true,
                [criteria.sortBy]: true,
                user: {
                    select: {
                        username: true,
                        pbUrl: true,
                    }
                },
            },
        };
    }

    processRecords(records, criteria: { sortBy: string; sortDirection: string; limit: number }) {
        let bestRunsPerUser = records.reduce((acc, record) => {
            const currentBest = acc[record.userId];
            const isBetterRun = !currentBest || (criteria.sortDirection === 'asc' ? record[criteria.sortBy] < currentBest[criteria.sortBy] : record[criteria.sortBy] > currentBest[criteria.sortBy]);
            if (isBetterRun) {
                acc[record.userId] = record;
            }
            return acc;
        }, {});

        let filteredRecords = Object.values(bestRunsPerUser);

        filteredRecords.sort((a, b) => {
            return criteria.sortDirection === 'asc' ? a[criteria.sortBy] - b[criteria.sortBy] : b[criteria.sortBy] - a[criteria.sortBy];
        });

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
                return {
                    user: {
                        username: record.username,
                        pbUrl: record.pbUrl,
                    },
                    userId: record.id,
                    rating: `${Math.floor(record.rating)} Elo`,
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