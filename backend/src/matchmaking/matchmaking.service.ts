import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Server,Socket } from 'socket.io';
import { GameGateway } from 'src/game/game.gateway';
import { MatchmakingGateway } from './matchmaking.gateway';
import { GlickoService } from 'src/ranked/glicko.service';
import { UserService } from 'src/user/user.service';

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
    private gapIncreaseAmount = 100; // Erhöhung des Skill Gaps
    private maxGap = 1000; // Maximale Erweiterung des Skill Gaps
    private matchmakingInterval: NodeJS.Timeout | null = null;

    constructor(
        private prismaService: PrismaService,
        private userService: UserService,
        private glickoService: GlickoService,
        private gameGateway: GameGateway,
        @Inject(forwardRef(() => MatchmakingGateway))
        private matchmakingGateway: MatchmakingGateway,
    ) { }

    userJoinedMmVue(client: Socket){
        client.join(this.socketMmRoomName);
        this.notifyAllUsersOfQueueSize();
    }

    userLeftMmVue(client: Socket){
        client.leave(this.socketMmRoomName);
        this.notifyAllUsersOfQueueSize();
    }

    removeUserFromQueue(userId: number) {
        if (this.checkIfUserIsInQueue(userId)) {
            delete this.queue[userId];
            if (this.checkIfMatchmakingQueueIsEmpty()) {
                this.stopMatchmakingInterval();
            }
            this.notifyAllUsersOfQueueSize();
        }
    }

    addUserToQueue(userId: number, glicko: number, client: Socket) {
        if (!this.checkIfUserIsInQueue(userId)) {
            this.queue[userId] = { glicko, searchStart: Date.now(), client };
            this.startMatchmakingInterval();
            this.notifyAllUsersOfQueueSize();
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
            const currentGap = Math.min(this.startGap + Math.floor(timeDiff / this.gapIncreaseInterval) * this.gapIncreaseAmount, this.maxGap);
            for (let j = i + 1; j < userIds.length; j++) {
                const opponentId = parseInt(userIds[j]);
                const opponent = this.queue[opponentId];
                if (!opponent) continue;

                const ratingDiff = Math.abs(glicko - opponent.glicko);
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
            this.gameGateway.setupRankedGame(player1.client, player2.client, player1ID, player1ID);
            onMatched();
        }
    }

    getVersusScreenDTO(player1ID: number, player1ID: number): dto_VersusScreen {
        const data: dto_VersusScreen = {

        };
        return data
    }

    async test(userId: number, opponentId: number){
        const user = await this.userService.getGlickoRatingsByUserId(userId);
        const opponent = await this.userService.getGlickoRatingsByUserId(opponentId);
        const glickoUser = this.glickoService.glicko.makePlayer(user.rating, user.ratingDeviation, user.volatility);
        const glickoOpponent = this.glickoService.glicko.makePlayer(opponent.rating, opponent.ratingDeviation, opponent.volatility);
        console.log(glickoUser);

        var expected = this.glickoService.glicko.predict(glickoUser, glickoOpponent);
        console.log("User1 has " + (expected * 100) + "% chances of winning against User2 in the next match");
        
        console.log("User1 old rating: " + glickoUser.getRating());
        console.log("User1 old rating deviation: " + glickoUser.getRd());
        console.log("User1 old volatility: " + glickoUser.getVol());
        console.log("User2 old rating: " + glickoOpponent.getRating());
        console.log("User2 old rating deviation: " + glickoOpponent.getRd());
        console.log("User2 old volatility: " + glickoOpponent.getVol());
        this.glickoService.glicko.updateRatings([[glickoUser, glickoOpponent, 1]]);
        console.log("User1 new rating: " + glickoUser.getRating());
        console.log("User1 new rating deviation: " + glickoUser.getRd());
        console.log("User1 new volatility: " + glickoUser.getVol());
        console.log("User2 new rating: " + glickoOpponent.getRating());
        console.log("User2 new rating deviation: " + glickoOpponent.getRd());
        console.log("User2 new volatility: " + glickoOpponent.getVol());
    }

    notifyAllUsersOfQueueSize() {
        this.matchmakingGateway.server.to(this.socketMmRoomName).emit('queueSize', this.getQueueSize());
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
        return token && token !== "null" && isGuest && isGuest === "null";
    }
}