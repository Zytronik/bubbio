export interface GameSettings {
    //grid settings
    gridWidth: number,
    gridHeight: number,
    gridExtraHeight: number,

    //angle settings
    minAngle: number,
    maxAngle: number,
    
    //queue settings
    queuePreviewSize: number,

    //internal mathvalues
    widthPrecisionUnits: number,
    collisionDetectionFactor: number,

    //sprintVictory
    sprintVictoryCondition: number,

    //mods
    clearFloatingBubbles: boolean,

    prefillBoard: boolean,
    prefillBoardAmount: number,
    refillBoard: boolean,
    refillBoardAtLine: number,
    refillAmount: number,
    bubbleBagSize: number,

    //garbage settings
    garbageMaxAtOnce: number,
    garbageCleanAmount: number,
    garbageColorAmount: number,
    garbageToKill: number,

    countDownDuration: number,

    //passtrough
    //combotable
    //bagsize
    //rngsettings
    //garbagesettings
        //after how many fired bubbles garbage spawns

    //gravity? time to shoot
}