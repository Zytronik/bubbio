import { OngoingGame } from "./game.network.i.ongoing-game";

export interface RankedMatch {
    rankedMatchId: string,
    player1Game: OngoingGame,
    player2Game: OngoingGame,
    player1Score: number,
    player2Score: number,

    player1VSConfirmed: boolean,
    player2VSConfirmed: boolean,
    player1SetupConfirmed: boolean,
    player2SetupConfirmed: boolean,
}