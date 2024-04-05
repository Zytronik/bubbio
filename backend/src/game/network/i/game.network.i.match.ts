import { OngoingGame } from "./game.network.i.ongoing-game";

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
}

export interface PlayerCredentials {
    playerID: number;
    playerName: string;
}