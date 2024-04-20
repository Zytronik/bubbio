import { GameStats } from "../../i/game.i.game-stats";

export interface dto_EndScreen {
    matchID: string;
    firstTo: number;
    player1Data: PlayerData;
    player2Data: PlayerData;
}

interface PlayerData {
    playerID: number;
    playerName: string;
    playerProfilePic: string;
    playerScore: number;
    hasWon: boolean;
    eloDiff: number;
    playerStats?: GameStats[];
}