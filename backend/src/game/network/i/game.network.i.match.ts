import { GameStats } from "src/game/i/game.i.game-stats";
import { OngoingGame } from "./game.network.i.ongoing-game";
import { Socket } from 'socket.io';

export interface Match {
    matchID: string,
    matchRoomName: string,
    transitionConfirmationMap: Map<string, boolean>, //<client.id, boolean>
    setupConfirmationMap: Map<string, boolean>, //<client.id, boolean>
    readyToStartConfirmationMap: Map<string, boolean>, //<client.id, boolean>
    ongoingGamesMap: Map<string, OngoingGame>, //<client.id, OngoingGame>
    scoresMap: Map<string, number>, //<client.id, number>
    firstTo: number,
    players: PlayerCredentials[],
    roundStats: Map<string, GameStats[]>, //<client.id, GameStats[]>
}

export interface PlayerCredentials {
    playerID: number;
    playerName: string;
    playerClient: Socket;
}