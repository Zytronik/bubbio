export interface GameStats {
    bubblesShot: number,
    bubblesCleared: number,
    attack: number,
    clears: number[][], //clears[4][1] = 3 (4 bubble clear with 1 wallbounce - occured 3 times)
    perfectClears: number,
    currentCombo: number,
    highestCombo: number,
}

// export interface GameStats {
//     gameStartTime: number,
//     gameEndTime: number,
//     gameDuration: number,

//     //timeLeft: number,
//     //score: number,

//     bubbleClearToWin: number,
//     bubblesCleared: number,
//     bubblesLeftToClear: number,

//     bubblesShot: number,
//     bubblesPerSecond: number,
//     bpsGraph: number[],
//     attack: number,
//     attackPerMinute: number,
//     attackPerBubble: number,
//     defense: number,
//     defensePerMinute: number,
//     defensePerBubble: number,

//     spikeNumber: number,
//     spikeAnimationStart: number,
//     pcText: boolean,
//     pcTextAnimationStart: number,
    
//     clear3: number,
//     clear4: number,
//     clear5: number,
//     clear3wb: number,
//     clear4wb: number,
//     clear5wb: number,
//     highestBubbleClear: number,

//     wallBounces: number,
//     wallBounceClears: number,

//     perfectClears: number,

//     currentCombo: number,
//     highestCombo: number,
// }