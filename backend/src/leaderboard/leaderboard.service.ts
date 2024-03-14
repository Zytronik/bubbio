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
        limit: number;
    }) {
        // Get the Prisma model for the specified gameMode
        const prismaModel = this.getPrismaModelForGameMode(criteria.gameMode);
    
        // Initialize the where clause for Prisma query
        let whereClause: Record<string, unknown> = {};
    
        // Conditionally add country filter when category is 'national' and country is provided
        if (criteria.category === 'national' && criteria.country) {
            // Adjust whereClause to navigate the relation to user and filter by country
            whereClause.user = {
                country: criteria.country,
            };
        }
    
        const bestRecords = await prismaModel.findMany({
            where: whereClause,
            orderBy: {
              [criteria.sortBy]: criteria.sortDirection,
            },
            distinct: ['userId'],
            take: criteria.limit,
            include: {
              user: {
                select: { 
                    username: true,
                    country: true,
                    pbUrl: true,
                },
              },
            },
          });
          
    
        // Filter the detailed records with the necessary condition
        const leaderboardRecords = bestRecords.filter(record => 
            criteria.category !== 'national' || record.user.country === criteria.country
        );
    
        return leaderboardRecords;
    }
    
    

}