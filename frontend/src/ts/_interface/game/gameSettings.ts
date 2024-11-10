export interface GameSettings {
    gridWidth: number,
    gridHeight: number,
    gridExtraHeight: number,
    minAngle: number,
    maxAngle: number,
    queuePreviewSize: number,
    widthPrecisionUnits: number,
    collisionDetectionFactor: number,

    sprintVictoryCondition: number,

    prefillBoard: boolean,
    prefillBoardAmount: number,
    refillBoard: boolean,
    refillBoardAtLine: number,
    refillAmount: number,

    bubbleBagSize: number,
    clearFloatingBubbles: boolean,
    
    garbageMaxAtOnce: number,
    garbageCleanAmount: number,
    garbageColorAmount: number,
    garbageToKill: number,
    
    countDownDuration: number,
    
    //passtrough
    //combotable
}