export interface GameStats {
    gameStartTime: number,
    gameEndTime: number,
    gameDuration: number,

    bubbleClearToWin: number,
    bubblesCleared: number,
    bubblesLeftToClear: number,

    bubblesShot: number,
    bubblesPerSecond: number,
    
    bubbleClearStats: number[],  
    highestBubbleClear: number,

    wallBounces: number,
    wallBounceClears: number,

    currentCombo: number,
    highestCombo: number,

    holds: number,
}