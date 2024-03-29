import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Server,Socket } from 'socket.io';
import { MatchmakingGateway } from './matchmaking.gateway';

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

    matchFound(userId: number, opponentId: number, onMatched: () => void) {
        const user = this.queue[userId];
        const opponent = this.queue[opponentId];

        if (user && opponent) {
            user.client.emit('matchFound', { userId, opponentId });
            opponent.client.emit('matchFound', { userId, opponentId });
            onMatched();
        }
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
        const { token, isGuest } = client.handshake.query;
        return token && token !== "null" && isGuest && isGuest === "null";
    }
}