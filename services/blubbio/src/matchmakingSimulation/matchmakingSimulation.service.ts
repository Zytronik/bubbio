import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MatchmakingSimulationGateway } from './matchmakingSimulation.gateway';
import { TestUser } from './i/matchmakingSimulation.i-testUser';

interface MatchmakingQueue {
    [name: string]: TestUser;
}

@Injectable()
export class MatchmakingSimulationService {
    private socketMmRoomName: string = 'matchmakingSimulationVue_389w4389w4uhbf803w4bnf83wn4f803w4fsdjkngsdfr';
    private queue: MatchmakingQueue = {};
    private speedFactor = 100;
    private startGap = 100; // Startwert für den akzeptablen Skill Gap
    private gapIncreaseInterval = 10000 / this.speedFactor; // Zeit in Millisekunden, nach der der Skill Gap erhöht wird
    private matchmakingIntervalTime = 5000 / this.speedFactor;
    private minGapIncreaseAmount = 10; // Minimale Erhöhung des Skill Gaps
    private gapIncreaseAmount = 100; // Erhöhung des Skill Gaps
    private maxGap = 800; // Maximale Erweiterung des Skill Gaps
    private matchmakingInterval: NodeJS.Timeout | null = null;

    private glicko2 = require('glicko2');
    private glicko = new this.glicko2.Glicko2({
        tau: 0.5,
        rating: 1500,
        rd: 250,
        vol: 0.06,
    });

    constructor(
        @Inject(forwardRef(() => MatchmakingSimulationGateway))
        private matchmakingSimulationGateway: MatchmakingSimulationGateway
    ) { }

    getSettings(){
        return {
            speedFactor: this.speedFactor,
            startGap: this.startGap,
            gapIncreaseInterval: this.gapIncreaseInterval,
            matchmakingIntervalTime: this.matchmakingIntervalTime,
            minGapIncreaseAmount: this.minGapIncreaseAmount,
            gapIncreaseAmount: this.gapIncreaseAmount,
            maxGap: this.maxGap,
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
            this.queue[user.name] = {
                name: user.name,
                rating: user.rating,
                ratingDeviation: user.ratingDeviation,
                volatility: user.volatility,
                amountOfQueues: user.amountOfQueues,
                maxAmountOfQueues: user.maxAmountOfQueues,
                startDeviation: user.startDeviation,
                searchStart: Date.now(),
                loopsInQueue: 0,
            };
            
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
        console.log('Matching players');
        console.log('__________________________');
        const userIds = Object.keys(this.queue);
        const matches = [];

        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            const user = this.queue[userId];
            if (!user) continue;
            const { rating, searchStart } = user;

            const currentTime = Date.now();
            const timeDiff = currentTime - searchStart;
            /* const currentGap = Math.min( //uses the time difference to calculate the current gap
                this.startGap + Math.max(
                    Math.log(1 + Math.floor(timeDiff / this.gapIncreaseInterval)) * this.gapIncreaseAmount,
                    this.minGapIncreaseAmount
                ), 
                this.maxGap
            ); */
            const currentGap = Math.min( //uses the loops in queue to calculate the current gap
                this.startGap + Math.max(
                    Math.log(1 + user.loopsInQueue) * this.gapIncreaseAmount,
                    this.minGapIncreaseAmount
                ), 
                this.maxGap
            );
            for (let j = i + 1; j < userIds.length; j++) {
                const opponentId = userIds[j];
                const opponent = this.queue[opponentId];
                if (!opponent) continue;

                const ratingDiff = Math.abs(rating - opponent.rating);
                console.log('Time Diff:', timeDiff);
                console.log('Logarithmic Increase:', Math.log(1 + Math.floor(timeDiff / this.gapIncreaseInterval)) * this.gapIncreaseAmount);
                console.log('Min Gap Increase:', this.minGapIncreaseAmount);
                console.log('Current Gap:', currentGap);
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

    matchFound(player1Name: string, player2Name: string, onMatched: () => void) {
        const player1 = this.queue[player1Name];
        const player2 = this.queue[player2Name];
        if (player1 && player2) {
            this.notfiyMatchFound(player1, player2);
            this.predictAndSimulateMatch(player1, player2);
            onMatched();
        }
    }

    predictAndSimulateMatch(player1: TestUser, player2: TestUser) {
        const winrate = this.predictWinrate(player1, player2);
        const random = Math.random() * 100;
        let winner = player2;
        let loser = player1;
        if(random <= winrate){
            winner = player1;
            loser = player2;
        }
        this.notfiyMatchResult(winner, loser);
        this.updatePlayerRatings(winner, loser);
    }

    updatePlayerRatings(winner: TestUser, loser: TestUser) {
        const glickoWinner = this.glicko.makePlayer(winner.rating, winner.ratingDeviation, winner.volatility);
        const glickoLoser = this.glicko.makePlayer(loser.rating, loser.ratingDeviation, loser.volatility);

        this.glicko.updateRatings([[glickoWinner, glickoLoser, 1]]);

        winner.rating = glickoWinner.getRating();
        winner.ratingDeviation = glickoWinner.getRd();
        winner.volatility = glickoWinner.getVol();

        loser.rating = glickoLoser.getRating();
        loser.ratingDeviation = glickoLoser.getRd();
        loser.volatility = glickoLoser.getVol();

        this.notifyUpdatedRatings(winner, loser);
    }

    notifyUpdatedRatings(winner: TestUser, loser: TestUser) {
        this.matchmakingSimulationGateway.server.to(this.socketMmRoomName).emit('ratingsUpdate', [winner, loser]);
    }

    notfiyMatchResult(player1: TestUser, player2: TestUser) {
        this.matchmakingSimulationGateway.server.to(this.socketMmRoomName).emit('matchResult', [player1, player2]);
    }

    predictWinrate(player1: TestUser, player2: TestUser): number {
        const glickoPlayer1 = this.glicko.makePlayer(player1.rating, player1.ratingDeviation, player1.volatility);
        const glickoPlayer2 = this.glicko.makePlayer(player2.rating, player2.ratingDeviation, player2.volatility);
        return this.glicko.predict(glickoPlayer1, glickoPlayer2) * 100;
    }

    notfiyMatchFound(player1: TestUser, player2: TestUser) {
        console.log(player1, player2)
        this.matchmakingSimulationGateway.server.to(this.socketMmRoomName).emit('matchFoundUpdate', [player1, player2]);
    }

    startMatchmakingInterval() {
        if (this.matchmakingInterval === null) {
            this.matchmakingInterval = setInterval(() => {
                Object.values(this.queue).forEach(user => user.loopsInQueue++);
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