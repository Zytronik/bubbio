import { Injectable } from "@nestjs/common";
import { dto_EndScreen } from "src/game/network/dto/game.network.dto.end-screen";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RankedService {
    constructor(private prisma: PrismaService) {}
    
    async saveMatchToDatabase(endScreenData: dto_EndScreen){
        try {
            const { matchID, firstTo, player1Data, player2Data } = endScreenData;
            const match = await this.prisma.ranked.create({
                data: {
                    matchId: matchID,
                    firstTo: firstTo,
                    userId1: player1Data.playerID,
                    user1Score: player1Data.playerScore,
                    user1HasWon: player1Data.hasWon,
                    user1EloDiff: player1Data.eloDiff,
                    user1Stats: player1Data.playerStats ? JSON.stringify(player1Data.playerStats) : null,
                    userId2: player2Data.playerID,
                    user2Score: player2Data.playerScore,
                    user2HasWon: player2Data.hasWon,
                    user2EloDiff: player2Data.eloDiff,
                    user2Stats: player2Data.playerStats ? JSON.stringify(player2Data.playerStats) : null,
                }
            });

            return match;
        } catch (error) {
            console.error('Failed to save match to database:', error);
            throw error;
        }
    }
}