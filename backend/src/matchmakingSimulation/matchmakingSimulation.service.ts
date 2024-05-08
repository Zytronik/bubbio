import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { TestUser } from './i/matchmakingSimulation.i-testUser';
import { MatchmakingSimulationGateway } from './matchmakingSimulation.gateway';

interface MatchmakingQueue {
    [name: string]: UserMatchmakingData;
}

interface UserMatchmakingData {
    glicko: number;
    searchStart: number;
}

@Injectable()
export class MatchmakingSimulationService {
    private socketMmRoomName: string = 'matchmakingSimulationVue_389w4389w4uhbf803w4bnf83wn4f803w4fsdjkngsdfr';
    private queue: MatchmakingQueue = {};
    private startGap = 100; // Startwert für den akzeptablen Skill Gap
    private gapIncreaseInterval = 1000; // Zeit in Millisekunden, nach der der Skill Gap erhöht wird
    private matchmakingIntervalTime = 1000;
    private gapIncreaseAmount = 100; // Erhöhung des Skill Gaps
    private maxGap = 1000; // Maximale Erweiterung des Skill Gaps
    private matchmakingInterval: NodeJS.Timeout | null = null;

    constructor(
        @Inject(forwardRef(() => MatchmakingSimulationGateway))
        private matchmakingSimulationGateway: MatchmakingSimulationGateway,
    ) { }

    addAllUsersToQueue(users: TestUser[]) {
        for (let user of users) {
            this.addUserToQueue(user);
        }
    }

    userJoinedMmSimVue(client: Socket){
        client.join(this.socketMmRoomName);
        this.clearQueue();
    }

    userLeftMmSimVue(client: Socket){
        client.leave(this.socketMmRoomName);
        this.clearQueue();
    }

    clearQueue(){
        this.queue = {};
        this.stopMatchmakingInterval();
    }

    notfiyQueueUpdate(){
       this.matchmakingSimulationGateway.server.to(this.socketMmRoomName).emit('queueUpdate', this.queue);
    }

    addUserToQueue(user: TestUser) {
        if (!this.checkIfUserIsInQueue(user)) {
            this.queue[user.name] = { glicko: user.rating, searchStart: Date.now() };
            this.startMatchmakingInterval();
            this.notfiyQueueUpdate();
        }
    }

    removeUserFromQueue(username: string) {
        if (username in this.queue) {
            delete this.queue[username];
            this.notfiyQueueUpdate();
            if (this.checkIfMatchmakingQueueIsEmpty()) {
                this.stopMatchmakingInterval();
            }
        }
    }
    
    checkIfUserIsInQueue(user: TestUser): boolean {
        const userName = user.name;
        return userName in this.queue;
    }

    matchPlayers() {
        const userIds = Object.keys(this.queue);
        const matches = [];

        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            const user = this.queue[userId];
            if (!user) continue;
            const { glicko, searchStart } = user;

            const currentTime = Date.now();
            const timeDiff = currentTime - searchStart;
            const currentGap = Math.min(this.startGap + Math.floor(timeDiff / this.gapIncreaseInterval) * this.gapIncreaseAmount, this.maxGap);
            for (let j = i + 1; j < userIds.length; j++) {
                const opponentId = userIds[j];
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
            this.notfiyMatchFound(player1ID, player2ID);
            onMatched();
        }
    }

    notfiyMatchFound(player1ID: number, player2ID: number) {
        this.matchmakingSimulationGateway.server.to(this.socketMmRoomName).emit('matchFoundUpdate', [player1ID, player2ID]);
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

    getQueueSize(){
        return Object.keys(this.queue).length;
    }
}