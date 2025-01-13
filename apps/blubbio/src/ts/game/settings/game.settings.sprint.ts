import { isLocal } from "@/ts/networking/paths";
import { GameSettings } from "./i/game.settings.i.game-settings";
import { COLLISION_DETECTION_FACTOR, COUNTDOWN_DURATION, GARBAGE_CLEAN_AMOUNT, GARBAGE_COLOR_AMOUNT, GARBAGE_MAX_AT_ONCE, GRID_EXTRA_HEIGHT, GRID_HEIGHT, GRID_WIDTH, MAX_ANGLE, MIN_ANGLE, QUEUE_PREVIEW_SIZE, REFILL_AMOUNT, WIDTH_PRECISION_UNITS } from "./ref/game.settings.ref.all-game-settings";

export function getSprintSettings(): GameSettings {
    const bagSize = 10;
    let prefillAmount = Math.floor(GRID_HEIGHT.defaultValue / 2);
    prefillAmount = (prefillAmount % 2 === 0) ? prefillAmount - 1 : prefillAmount;
    const refillAmount = Math.ceil(prefillAmount / 3);
    let sprintVictoryCondition = 100;
    if(isLocal){
        sprintVictoryCondition = 30;
    }
    return {
        gridWidth: GRID_WIDTH.defaultValue,
        gridHeight: GRID_HEIGHT.defaultValue,
        gridExtraHeight: GRID_EXTRA_HEIGHT.defaultValue,
        minAngle: MIN_ANGLE.defaultValue,
        maxAngle: MAX_ANGLE.defaultValue,
        queuePreviewSize: QUEUE_PREVIEW_SIZE.defaultValue,
        widthPrecisionUnits: WIDTH_PRECISION_UNITS.defaultValue,
        collisionDetectionFactor: COLLISION_DETECTION_FACTOR.defaultValue,
        sprintVictoryCondition: sprintVictoryCondition,
        clearFloatingBubbles: true,
        prefillBoard: true,
        prefillBoardAmount: prefillAmount,
        refillBoard: true,
        refillBoardAtLine: refillAmount,
        refillAmount: REFILL_AMOUNT.defaultValue,
        bubbleBagSize: bagSize,
        garbageMaxAtOnce: GARBAGE_MAX_AT_ONCE.defaultValue,
        garbageCleanAmount: GARBAGE_CLEAN_AMOUNT.defaultValue,
        garbageColorAmount: GARBAGE_COLOR_AMOUNT.defaultValue,
        garbageToKill: 30,
        countDownDuration: COUNTDOWN_DURATION.defaultValue,
    };
}