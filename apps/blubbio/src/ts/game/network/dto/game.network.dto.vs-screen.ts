export interface dto_VersusScreen {
    matchID: string;
    player1Data: playerData;
    player2Data: playerData;
}

interface playerData {
    playerID: number;
    playerName: string;
    playerRank: string;
    playerGlobalRank: number;
    playerNationalRank: number;
    playerGlicko: number;
    playerRD: number;
    playerProfilePicture: string;
    playerCountry: string;
}