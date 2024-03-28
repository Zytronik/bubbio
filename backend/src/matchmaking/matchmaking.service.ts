import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Socket } from 'socket.io';

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
    private acceptableGap = 100; // Startwert für den akzeptablen Skill Gap
    private gapIncreaseInterval = 5000; // Zeit in Millisekunden, nach der der Skill Gap erhöht wird
    private matchmakingIntervalTime = 5000;
    private gapIncreaseAmount = 100; // Erhöhung des Skill Gaps
    private maxGap = 1000; // Maximale Erweiterung des Skill Gaps
    private matchmakingInterval: NodeJS.Timeout | null = null;

    constructor(
        private prismaService: PrismaService,
    ) { }

    removeUserFromQueue(userId: number) {
        if (this.checkIfUserIsInQueue(userId)) {
            delete this.queue[userId];
            if (this.checkIfMatchmakingQueueIsEmpty()) {
                this.stopMatchmakingInterval();
            } else {
                this.notifyAllUsersOfEstimatedWaitTime();
            }
            this.notifyAllUsersOfQueueSize();
            //console.log(this.queue);
        }
    }

    addUserToQueue(userId: number, glicko: number, client: Socket) {
        if (!this.checkIfUserIsInQueue(userId)) {
            this.queue[userId] = { glicko, searchStart: Date.now(), client };
            this.startMatchmakingInterval();
            this.notifyAllUsersOfEstimatedWaitTime();
            this.notifyAllUsersOfQueueSize();
            console.log(this.queue);
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
        console.log('Matching players');
        const userIds = Object.keys(this.queue);
        const matches = [];

        for (let i = 0; i < userIds.length; i++) {
            const userId = parseInt(userIds[i]);
            const user = this.queue[userId];
            if (!user) continue;
            const { glicko, searchStart } = user;

            const currentTime = Date.now();
            const timeDiff = currentTime - searchStart;
            const currentGap = Math.min(this.acceptableGap + Math.floor(timeDiff / this.gapIncreaseInterval) * this.gapIncreaseAmount, this.maxGap);
            for (let j = i + 1; j < userIds.length; j++) {
                const opponentId = parseInt(userIds[j]);
                const opponent = this.queue[opponentId];
                console.log(currentGap)
                if (!opponent) continue;

                const ratingDiff = Math.abs(glicko - opponent.glicko);
                console.log(ratingDiff, currentGap);
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
        console.log(`Match gefunden zwischen ${userId} und ${opponentId}`);
        const user = this.queue[userId];
        const opponent = this.queue[opponentId];

        if (user && opponent) {
            user.client.emit('matchFound', { userId, opponentId });
            opponent.client.emit('matchFound', { userId, opponentId });
            onMatched();
        }
    }

    calculateEstimatedWaitTime(userId: number): number | string{
        if (this.getQueueSize() <= 1) {
            return "Unknown";
        }

        const userIds = Object.keys(this.queue);
        let matchFound = false;
        let counter = 0;

        while(!matchFound){
            for (let i = 0; i < userIds.length; i++) {
                const user1Id = parseInt(userIds[i]);
                const user1 = this.queue[user1Id];
                if (!user1) continue;
                const { glicko } = user1;
                const currentGap = Math.min(this.acceptableGap + counter * this.gapIncreaseAmount, this.maxGap);
                for (let j = i + 1; j < userIds.length; j++) {
                    const user2Id = parseInt(userIds[j]);
                    const user2 = this.queue[user2Id];
                    if (!user2) continue;

                    const ratingDiff = Math.abs(glicko - user2.glicko);
                    /* console.log(currentGap); */
                    if (ratingDiff <= currentGap) {
                        if(user1Id === userId || user2Id === userId){
                            matchFound = true;
                        }
                        break;
                    }
                }
            }
            counter++;
        }

        return counter * this.gapIncreaseInterval / 1000;

    }

    notifyAllUsersOfEstimatedWaitTime() {
        Object.values(this.queue).forEach(user => {
            const estimatedWaitTime = this.calculateEstimatedWaitTime(user.client.data.user.id);
            user.client.emit('estimatedWaitTime', estimatedWaitTime);
        });
    }

    notifyAllUsersOfQueueSize() {
        Object.values(this.queue).forEach(user => {
            user.client.emit('queueSize', this.getQueueSize());
        });
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