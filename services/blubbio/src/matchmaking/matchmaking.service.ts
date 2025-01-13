import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Server,Socket } from 'socket.io';
import { GameGateway } from 'src/game/game.gateway';
import { MatchmakingGateway } from './matchmaking.gateway';
import { UserService } from 'src/user/user.service';
import { dto_VersusScreen } from 'src/game/network/dto/game.network.dto.vs-screen';
import { RanksService } from 'src/ranked/ranks.service';
import { unrankedRatingDeviation } from 'src/ranked/ranks';

interface UserMatchmakingData {
    glicko: number;
    searchStart: number;
    client: Socket;
}

interface MatchmakingQueue {
    [userId: number]: UserMatchmakingData;
}

@Injectable()
export class MatchmakingService {
    private queue: MatchmakingQueue = {};
    private socketMmRoomName: string = 'matchmakingVue_ilkjadsrhngijaerhgipusearoiugjeasroiughbqaerougbqerutbqer';
    private startGap = 100; // Startwert für den akzeptablen Skill Gap
    private gapIncreaseInterval = 5000; // Zeit in Millisekunden, nach der der Skill Gap erhöht wird
    private matchmakingIntervalTime = 5000; 
    private minGapIncreaseAmount = 20; // Minimale Erhöhung des Skill Gaps
    private gapIncreaseAmount = 300; // Erhöhung des Skill Gaps
    private maxGap = 1500; // Maximale Erweiterung des Skill Gaps
    private matchmakingInterval: NodeJS.Timeout | null = null;

    constructor(
        private prismaService: PrismaService,
        private userService: UserService,
        private gameGateway: GameGateway,
        @Inject(forwardRef(() => MatchmakingGateway))
        private matchmakingGateway: MatchmakingGateway,
        private ranksService: RanksService
    ) { }

    userJoinedMmVue(client: Socket){
        client.join(this.socketMmRoomName);
        this.notifyAllUsersOfCurrentQueue();
    }

    userLeftMmVue(client: Socket){
        client.leave(this.socketMmRoomName);
        this.notifyAllUsersOfCurrentQueue();
    }

    removeUserFromQueue(userId: number) {
        if (this.checkIfUserIsInQueue(userId)) {
            delete this.queue[userId];
            if (this.checkIfMatchmakingQueueIsEmpty()) {
                this.stopMatchmakingInterval();
            }
            this.notifyAllUsersOfCurrentQueue();
        }
    }

    addUserToQueue(userId: number, glicko: number, client: Socket) {
        if (!this.checkIfUserIsInQueue(userId)) {
            this.queue[userId] = { glicko, searchStart: Date.now(), client };
            this.startMatchmakingInterval();
            this.notifyAllUsersOfCurrentQueue();
        }
    }

    startMatchmakingInterval() {
        if (this.matchmakingInterval === null) {
            this.matchmakingInterval = setInterval(() => {
                this.matchPlayers();
                if (this.checkIfMatchmakingQueueIsEmpty() && this.matchmakingInterval) {
                    clearInterval(this.matchmakingInterval);
                    this.matchmakingInterval = null;
                }
            }, this.matchmakingIntervalTime);
        }
    }

    stopMatchmakingInterval() {
        if (this.matchmakingInterval) {
            clearInterval(this.matchmakingInterval);
            this.matchmakingInterval = null;
        }
    }

    checkIfMatchmakingQueueIsEmpty() {
        return this.getQueueSize() === 0;
    }

    checkIfUserIsInQueue(userId: number): boolean {
        return !!this.queue[userId];
    }

    matchPlayers() {
        const userIds = Object.keys(this.queue);
        const matches = [];

        for (let i = 0; i < userIds.length; i++) {
            const userId = parseInt(userIds[i]);
            const user = this.queue[userId];
            if (!user) continue;
            const { glicko, searchStart } = user;

            const currentTime = Date.now();
            const timeDiff = currentTime - searchStart;
            //const currentGap = Math.min(this.startGap + Math.floor(timeDiff / this.gapIncreaseInterval) * this.gapIncreaseAmount, this.maxGap);
            const currentGap = Math.min( //uses the time difference to calculate the current gap
                this.startGap + Math.max(
                    Math.log(1 + Math.floor(timeDiff / this.gapIncreaseInterval)) * this.gapIncreaseAmount,
                    this.minGapIncreaseAmount
                ), 
                this.maxGap
            );
            for (let j = i + 1; j < userIds.length; j++) {
                const opponentId = parseInt(userIds[j]);
                const opponent = this.queue[opponentId];
                if (!opponent) continue;

                const ratingDiff = Math.abs(glicko - opponent.glicko);
                /* console.log('Time Diff:', timeDiff);
                console.log('Gap Increase Interval:', this.gapIncreaseInterval);
                console.log('Loop:', timeDiff / this.gapIncreaseInterval);
                console.log('Logarithmic Increase:', Math.log(1 + timeDiff / this.gapIncreaseInterval));
                console.log('Current Gap:', currentGap);
                console.log('-----------------------------------------'); */
                if (ratingDiff <= currentGap) {
                    matches.push([userId, opponentId]);
                    break;
                }
            }
        }

        matches.forEach(([userId, opponentId]) => {
            this.matchFound(userId, opponentId, () => {
                this.removeUserFromQueue(userId);
                this.removeUserFromQueue(opponentId);
            });
        });
    }

    matchFound(player1ID: number, player2ID: number, onMatched: () => void) {
        const player1 = this.queue[player1ID];
        const player2 = this.queue[player2ID];
        if (player1 && player2) {
            this.gameGateway.setupRankedGame(player1.client, player2.client, player1ID, player2ID);
            onMatched();
        }
    }

    async getVersusScreenDTO(player1ID: number, player2ID: number, givenMatchID): Promise<dto_VersusScreen> {
        const player1Name = await this.userService.getUsernameById(player1ID);
        const player1Glicko = await this.userService.getGlickoRatingsByUserId(player1ID);
        const player1Profile = await this.userService.getUserProfileByUsername(player1Name);
        const player1Rank = await this.ranksService.getRankInfo(player1ID);
        const player1GlobalRank = player1Glicko.ratingDeviation < unrankedRatingDeviation ? await this.userService.getGlobalRank(player1ID): null;
        const player1NationalRank = player1Glicko.ratingDeviation < unrankedRatingDeviation ? await this.userService.getNationalRank(player1ID) : null;
        const player1RankMaybeUnranked = player1Glicko.ratingDeviation < unrankedRatingDeviation ? player1Rank.iconName : null;

        const player2Name = await this.userService.getUsernameById(player2ID);
        const player2Glicko = await this.userService.getGlickoRatingsByUserId(player2ID);
        const player2Profile = await this.userService.getUserProfileByUsername(player2Name);
        const player2Rank = await this.ranksService.getRankInfo(player2ID);
        const player2GlobalRank = player2Glicko.ratingDeviation < unrankedRatingDeviation ? await this.userService.getGlobalRank(player2ID): null;
        const player2NationalRank = player2Glicko.ratingDeviation < unrankedRatingDeviation ? await this.userService.getNationalRank(player2ID) : null;
        const player2RankMaybeUnranked = player2Glicko.ratingDeviation < unrankedRatingDeviation ? player2Rank.iconName : null;

        const data: dto_VersusScreen = {
            matchID: givenMatchID,
            player1Data: {
                playerID: player1ID,
                playerName: player1Name,
                playerRank: player1RankMaybeUnranked,
                playerGlobalRank: player1GlobalRank,
                playerNationalRank: player1NationalRank,
                playerGlicko: Math.round(player1Glicko.rating),
                playerRD: Math.round(player1Glicko.ratingDeviation),
                playerProfilePicture: player1Profile.pbUrl,
                playerCountry: player1Profile.country,
            },
            player2Data: {
                playerID: player2ID,
                playerName: player2Name,
                playerRank: player2RankMaybeUnranked,
                playerGlobalRank: player2GlobalRank,
                playerNationalRank: player2NationalRank,
                playerGlicko: Math.round(player2Glicko.rating),
                playerRD: Math.round(player2Glicko.ratingDeviation),
                playerProfilePicture: player2Profile.pbUrl,
                playerCountry: player2Profile.country,
            }
        };
        return data
    }

    notifyAllUsersOfCurrentQueue() {
        this.matchmakingGateway.server.to(this.socketMmRoomName).emit('queueSize', this.getQueueSize());
        this.matchmakingGateway.server.to(this.socketMmRoomName).emit('rankedGamesCount', this.gameGateway.getOngoingRankedMatchAmount());
    }

    getQueueSize(){
        return Object.keys(this.queue).length;
    }

    async getGlickoByUserId(userId: number): Promise<{ rating: number } | null> {
        if (!userId) {
            return null;
        }
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: { rating: true },
        });
        return user ? { rating: user.rating } : null;
    }

    isLoggedInUser(client: Socket): boolean {
        if(!client.id){
            return false;
        }
        const { token, isGuest } = client.handshake.query;
        return token && token !== "null" && isGuest && isGuest === "null" && client.data.user && client.data.user.id;
    }
}