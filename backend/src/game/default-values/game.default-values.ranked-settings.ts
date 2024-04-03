import { GameSettings } from "../settings/i/game.settings.i.game-settings";

export const rankedSettings: GameSettings = {
    gridWidth: 8,
    gridHeight: 15,
    gridExtraHeight: 3,
    minAngle: 12,
    maxAngle: 168,
    queuePreviewSize: 5,
    widthPrecisionUnits: 10000000,
    collisionDetectionFactor: 0.3,
    sprintVictoryCondition: Infinity,
    clearFloatingBubbles: true,
    prefillBoard: true,
    prefillBoardAmount: 7,
    refillBoard: false,
    refillBoardAtLine: 0,
    refillAmount: 0,
    bubbleBagSize: 7,
    garbageMaxAtOnce: 3,
    garbageCleanAmount: 3,
    garbageColorAmount: 3,
    countDownDuration: 3000,
}

export const rankedFirstTo = 2;