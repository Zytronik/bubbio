export interface dto_ScoreScreen {
    matchID: string;
    firstTo: number;
    player1Data: PlayerData;
    player2Data: PlayerData;
}

interface PlayerData {
    playerID: number;
    playerName: string;
    playerScore: number;
}