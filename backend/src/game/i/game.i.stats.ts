export interface GameStats {
    gameStartTime: number,
    gameEndTime: number,
    gameDuration: number,
    currentTime: number,
    formattedCurrentTime: string,

    //timeLeft: number,
    //score: number,

    bubbleClearToWin: number,
    bubblesCleared: number,
    bubblesLeftToClear: number,

    bubblesShot: number,
    bubblesPerSecond: number,
    
    //examplex: bubbleClearStats[3] = 12 -> twelve clears of 3 bubbles ; [-4] = 1 -> one clear of 4 bubbles with wallbounce
    bubbleClearStats: number[],  
    highestBubbleClear: number,

    wallBounces: number,
    wallBounceClears: number,

    currentCombo: number,
    highestCombo: number,

    keysPressed: number,
    keysPerSecond: number,
    keysPerBubble: number,

    angleChanged: number,
    angleChangePerBubble: number,

    holds: number,

    // handlingsUsed: dont know yet xd
    // gameSubmittedAtTime: number
}