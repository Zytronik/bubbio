import { showASCIIDefeat, showASCIIVictory, startASCIIAnimation, startCountdownAnimation, stopASCIIAnimation, stopCountdownAnimation } from "./visuals/game.visuals.ascii";
import { GameInstance } from "./i/game.i.game-instance";
import { disableGameInputs, disableResetInput, enableGameInputs, enableResetInput } from "../input/input.input-manager";
import { cleanUpAngle } from "./logic/game.logic.angle";
import { angleLeftInput, angleRightInput, resetInput } from "../input/input.all-inputs";
import { GameStats } from "./i/game.i.game-stats";
import { Bubble } from "./i/game.i.bubble";
import { Grid } from "./i/game.i.grid";
import { calculatePreview, shootBubble } from "./logic/game.logic.shoot";
import { resetStatDisplays, startStatDisplay, stopStatDisplay } from "./visuals/game.visuals.stat-display";
import { createGameInstance, resetGameInstance } from "./logic/game.logic.instance-creator";
import { GAME_MODE } from "./settings/i/game.settings.e.game-modes";
import { GameTransitions } from "./i/game.i.game-transitions";
import { holdBubble, updateBubbleQueueAndCurrent } from "./logic/game.logic.bubble-manager";
import { backendSetupGame, submitGameToDB } from "./network/game.network-commands";
import { digMod, precisionMod, randomnessMod } from "./settings/game.settings.all-mods";
import { receiveGarbage } from "./logic/game.logic.garbage";
import { GameSettings } from "./settings/i/game.settings.i.game-settings";
import { HandlingSettings } from "./settings/i/game.settings.i.handling-settings";
import { BUBBLE_BAG_SIZE, GARBAGE_CLEAN_AMOUNT, COLLISION_DETECTION_FACTOR, GRID_EXTRA_HEIGHT, GRID_HEIGHT, GRID_WIDTH, MAX_ANGLE, GARBAGE_MAX_AT_ONCE, MIN_ANGLE, QUEUE_PREVIEW_SIZE, REFILL_AMOUNT, WIDTH_PRECISION_UNITS, GARBAGE_COLOR_AMOUNT, COUNTDOWN_DURATION } from "./settings/game.settings.all-game-settings";
import { DEFAULT_APS, TOGGLE_APS } from "./settings/game.settings.all-handling-settings";
import eventBus from "../page/page.event-bus";

let playerGameInstance: GameInstance;
export function setupSprintGame(): void {
    const gameMode = GAME_MODE.SPRINT;
    const transitions: GameTransitions = {
        onGameStart: startSprint,
        onGameReset: resetSprint,
        onGameAbort: leaveSprint,
        onGameDefeat: sprintDeath,
        onGameVictory: sprintVictory
    }
    const gameSettings = getSprintSettings();
    const handlingSettings = getHandlingSettings();
    playerGameInstance = createGameInstance(gameMode, gameSettings, handlingSettings, transitions);
    backendSetupGame(gameMode, gameSettings, handlingSettings)

    function startSprint(): void {
        enableResetInput();
        showCountDownAndStart();
    }
    function resetSprint(): void {
        disableGameplay();
        resetGameInstance(playerGameInstance);
        showCountDownAndStart();
    }
    function leaveSprint(): void {
        disableResetInput();
        disableGameplay();
    }
    function sprintVictory(): void {
        disableGameplay();
        showASCIIVictory();
        eventBus.emit("sprintVictory");
        submitGameToDB(playerGameInstance.stats);
    }
    function sprintDeath(): void {
        disableGameplay();
        showASCIIDefeat();
    }
}

function getSprintSettings(): GameSettings {
    const floating = !precisionMod.enabled.value;
    const filled = digMod.enabled.value;
    const bagSize = randomnessMod.selected.value;
    let prefillAmount = Math.floor(GRID_HEIGHT.defaultValue / 2);
    prefillAmount = (prefillAmount % 2 === 0) ? prefillAmount - 1 : prefillAmount;
    const refillAmount = Math.ceil(prefillAmount / 2);
    return {
        gridWidth: GRID_WIDTH.defaultValue,
        gridHeight: GRID_HEIGHT.defaultValue,
        gridExtraHeight: GRID_EXTRA_HEIGHT.defaultValue,
        minAngle: MIN_ANGLE.defaultValue,
        maxAngle: MAX_ANGLE.defaultValue,
        queuePreviewSize: QUEUE_PREVIEW_SIZE.defaultValue,
        widthPrecisionUnits: WIDTH_PRECISION_UNITS.defaultValue,
        collisionDetectionFactor: COLLISION_DETECTION_FACTOR.defaultValue,
        sprintVictoryCondition: getSprintVictoryCondition(filled, floating),
        clearFloatingBubbles: floating,
        prefillBoard: filled,
        prefillBoardAmount: prefillAmount,
        refillBoard: filled,
        refillBoardAtLine: refillAmount,
        refillAmount: REFILL_AMOUNT.defaultValue,
        bubbleBagSize: bagSize,
        garbageMaxAtOnce: GARBAGE_MAX_AT_ONCE.defaultValue,
        garbageCleanAmount: GARBAGE_CLEAN_AMOUNT.defaultValue,
        garbageColorAmount: GARBAGE_COLOR_AMOUNT.defaultValue,
        countDownDuration: COUNTDOWN_DURATION.defaultValue,
    };
}

function getHandlingSettings(): HandlingSettings {
    return {
        defaultAPS: DEFAULT_APS.defaultValue,
        toggleAPS: TOGGLE_APS.defaultValue,
    };
}

function getSprintVictoryCondition(floating: boolean, filled: boolean): number {
    if (floating && filled) {
        return 200;
    } else if (!floating && filled) {
        return 200;
    } else if (floating && !filled) {
        return 100;
    } else {
        return 50;
    }
}


export function startGame(): void {
    playerGameInstance.gameTransitions.onGameStart();
}
export function resetGame(): void {
    playerGameInstance.gameTransitions.onGameReset();
}
export function leaveGame(): void {
    playerGameInstance.gameTransitions.onGameAbort();
}

function showCountDownAndStart(): void {
    resetStatDisplays();
    startCountdownAnimation(playerGameInstance.gameSettings.countDownDuration, afterCountdown)
    function afterCountdown(): void {
        startASCIIAnimation();
        startStatDisplay();
        enableGameInputs();
        enableResetInput();
        playerGameInstance.stats.gameStartTime = performance.now();
    }
}
function disableGameplay(): void {
    stopCountdownAnimation();
    const stats = playerGameInstance.stats;
    stats.gameEndTime = performance.now();
    stats.gameDuration = stats.gameEndTime - stats.gameStartTime;
    stats.bubblesPerSecond = Number((stats.bubblesShot / stats.gameDuration * 1000).toFixed(2));
    //TODO: save playtime/score
    disableGameInputs();
    stopASCIIAnimation();
    stopStatDisplay();
}


//Inputs
export function angleLeft(): void {
    const oldAngle = playerGameInstance.angle;
    const timePassed = performance.now() - angleLeftInput.lastFiredAtTime;
    const leftAmount = playerGameInstance.currentAPS * timePassed / 1000
    playerGameInstance.angle = cleanUpAngle(oldAngle - leftAmount, playerGameInstance.gameSettings);
}
export function angleRight(): void {
    const oldAngle = playerGameInstance.angle;
    const timePassed = performance.now() - angleRightInput.lastFiredAtTime;
    const rightAmount = playerGameInstance.currentAPS * timePassed / 1000
    playerGameInstance.angle = cleanUpAngle(oldAngle + rightAmount, playerGameInstance.gameSettings);
}
export function angleCenter(): void {
    playerGameInstance.angle = 90;
}
export function changeAPS(): void {
    playerGameInstance.currentAPS = playerGameInstance.handlingSettings.toggleAPS;
}
export function revertAPS(): void {
    playerGameInstance.currentAPS = playerGameInstance.handlingSettings.defaultAPS;
}
export function triggerShoot(): void {
    const bubblesCleared = shootBubble(playerGameInstance);
    if (!(bubblesCleared > 0)) {
        receiveGarbage(playerGameInstance);
    }
    if (playerGameInstance.gameSettings.refillBoard && playerGameInstance.queuedGarbage === 0) {
        const refillBoardAtLine = playerGameInstance.gameSettings.refillBoardAtLine;
        const line = playerGameInstance.playGrid.rows[refillBoardAtLine]
        let hasToRefill = false;
        for (const field of line.fields) {
            if (field.bubble === undefined) {
                hasToRefill = true
            }
        }
        if (hasToRefill) {
            playerGameInstance.queuedGarbage += playerGameInstance.gameSettings.refillAmount;
        }
    }
    updateBubbleQueueAndCurrent(playerGameInstance);
}
export function triggerHold(): void {
    holdBubble(playerGameInstance);
}
export function debugTriggerGarbage(): void {
    playerGameInstance.queuedGarbage += 1;
}


//Exported visuals
export function getGameStats(): GameStats {
    return playerGameInstance.stats;
}
export function getAngle(): number {
    return playerGameInstance.angle;
}
export function getCurrentBubble(): Bubble {
    return playerGameInstance.currentBubble;
}
export function getHoldBubble(): Bubble {
    if (!playerGameInstance.holdBubble) {
        return {
            color: "",
            ascii: "",
            type: 0
        }
    }
    return playerGameInstance.holdBubble as Bubble;
}
export function getBubbleQueue(): Bubble[] {
    return playerGameInstance.bubbleQueue;
}
export function getPlayGrid(): Grid {
    return playerGameInstance.playGrid;
}
export function updatePreviewBubble(): void {
    calculatePreview(playerGameInstance);
}
export function getQueueSize(): number {
    return playerGameInstance.gameSettings.queuePreviewSize;
}
export function getIncomingGarbageAmount(): number {
    return playerGameInstance.queuedGarbage;
}
export function getGridTotalHeight(): number {
    return playerGameInstance.playGrid.gridHeight + playerGameInstance.playGrid.extraGridHeight;
}