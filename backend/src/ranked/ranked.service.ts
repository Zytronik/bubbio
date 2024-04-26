import { Injectable } from "@nestjs/common";
import { dto_EndScreen } from "src/game/network/dto/game.network.dto.end-screen";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RankedService {
    constructor(private prisma: PrismaService) { }

    async saveMatchToDatabase(endScreenData: dto_EndScreen) {
        try {
            const { matchID, firstTo, player1Data, player2Data } = endScreenData;
            const createdMatch = await this.prisma.ranked.create({
                data: {
                    matchId: matchID,
                    firstTo: firstTo,
                    user1Score: player1Data.playerScore,
                    user1HasWon: player1Data.hasWon,
                    user1EloDiff: player1Data.eloDiff,
                    user1Stats: player1Data.playerStats ? JSON.stringify(player1Data.playerStats) : "[]",
                    user2Score: player2Data.playerScore,
                    user2HasWon: player2Data.hasWon,
                    user2EloDiff: player2Data.eloDiff,
                    user2Stats: player2Data.playerStats ? JSON.stringify(player2Data.playerStats) : "[]",
                    user1: {
                        connect: { id: player1Data.playerID }
                    },
                    user2: {
                        connect: { id: player2Data.playerID }
                    },
                }
            });
            return createdMatch;
        } catch (error) {
            console.error('Failed to save match to database:', error);
            throw error;
        }
    }

    async getPlayedMatchesByUserID(userID: number) {
        try {
            const matches = await this.prisma.ranked.findMany({
                where: {
                    OR: [
                        { userId1: userID },
                        { userId2: userID }
                    ]
                },
                orderBy: {
                    submittedAt: 'desc'
                },
            });
            return matches;
        } catch (error) {
            console.error('Failed to get matches by user ID:', error);
            throw error;
        }
    }

    async getWonMatchesByUserID(userID: number) {
        try {
            const matches = await this.prisma.ranked.findMany({
                where: {
                    OR: [
                        { userId1: userID, user1HasWon: true },
                        { userId2: userID, user2HasWon: true }
                    ]
                },
                orderBy: {
                    submittedAt: 'desc'
                }
            });
            return matches;
        } catch (error) {
            console.error('Failed to get matches by user ID:', error);
            throw error;
        }
    }

    async getHistory(userID: number) {
        try {
            const matches = await this.prisma.ranked.findMany({
                where: {
                    OR: [
                        { userId1: userID },
                        { userId2: userID }
                    ]
                },
                orderBy: {
                    submittedAt: 'desc'
                },
                take: 10,
                include: {
                    user1: {
                        select: {
                            username: true,
                            pbUrl: true,
                        }
                    },
                    user2: {
                        select: {
                            username: true,
                            pbUrl: true,
                        }
                    }
                }
            });

            return matches.map(match => {
                const me = match.userId1 === userID;
                return {
                    id: match.id,
                    submittedAt: match.submittedAt,
                    firstTo: match.firstTo,
                    user1Name: me ? match.user1.username : match.user2.username,
                    user1Score: me ? match.user1Score : match.user2Score,
                    user1HasWon: me ? match.user1HasWon : match.user2HasWon,
                    user1PbUrl: me ? match.user1.pbUrl : match.user2.pbUrl,
                    user2Name: me ? match.user2.username : match.user1.username,
                    user2Score: me ? match.user2Score : match.user1Score,
                    user2HasWon: me ? match.user2HasWon : match.user1HasWon,
                    user2PbUrl: me ? match.user2.pbUrl : match.user1.pbUrl,
                };
            });
        } catch (error) {
            console.error('Failed to get matches by user ID:', error);
            throw error;
        }
    }

    async getAverageStats(userId: number) {
        const rankedMatches = await this.prisma.ranked.findMany({
            where: {
                OR: [
                    { userId1: userId },
                    { userId2: userId }
                ]
            },
            select: {
                user1Stats: true,
                user2Stats: true,
                userId1: true,
                userId2: true
            }
        });

        let totalBubblesPerSecond = 0;
        let totalAttackPerMinute = 0;
        let totalDefensePerMinute = 0;
        let count = 0;

        // Process each match to extract and aggregate stats
        rankedMatches.forEach(match => {
            let stats;
            if (match.userId1 === userId) {
                stats = JSON.parse(match.user1Stats);
            } else if (match.userId2 === userId) {
                stats = JSON.parse(match.user2Stats);
            }

            // Aggregate stats from all games in the match
            stats.forEach(game => {
                totalBubblesPerSecond += game.bubblesPerSecond;
                totalAttackPerMinute += game.attackPerMinute;
                totalDefensePerMinute += game.defensePerMinute;
                count++;
            });
        });

        // Calculate averages
        return {
            averageBubblesPerSecond: totalBubblesPerSecond / count,
            averageAttackPerMinute: totalAttackPerMinute / count,
            averageDefensePerMinute: totalDefensePerMinute / count,
        }
    }

}