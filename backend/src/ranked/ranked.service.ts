import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
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
}