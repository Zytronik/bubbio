export interface GameStats {
    gameStartTime: number,
    gameEndTime: number,
    gameDuration: number,

    //timeLeft: number,
    //score: number,

    bubbleClearToWin: number,
    bubblesCleared: number,
    bubblesLeftToClear: number,

    bubblesShot: number,
    bubblesPerSecond: number,
    bpsGraph: number[],
    attack: number,
    attackPerMinute: number,
    attackPerBubble: number
    
    clear3: number,
    clear4: number,
    clear5: number,
    clear3wb: number,
    clear4wb: number,
    clear5wb: number,
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