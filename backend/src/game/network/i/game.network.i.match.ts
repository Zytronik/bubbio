import { OngoingGame } from "./game.network.i.ongoing-game";

export interface Match {
    matchID: string,
    matchRoomName: string,
    vsConfirmationMap: Map<string, boolean>, //<client.id, boolean>
    setupConfirmationMap: Map<string, boolean>, //<client.id, boolean>
    ongoingGamesMap: Map<string, OngoingGame>, //<client.id, OngoingGame>
    scoresMap: Map<string, number>, //<client.id, number>
}