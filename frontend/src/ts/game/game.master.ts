import { showASCIIDefeat, showASCIIVictory, startASCIIAnimation, startCountdownAnimation, stopASCIIAnimation, stopCountdownAnimation } from "./visuals/game.visuals.ascii";
import { GameInstance } from "./i/game.i.game-instance";
import { disableChannelInput, disableGameInputs, disableResetInput, enableChannelInput, enableGameInputs, enableResetInput } from "../input/input.input-manager";
import { cleanUpAngle } from "./logic/game.logic.angle";
import { angleLeftInput, angleRightInput } from "../input/input.all-inputs";
import { executeShot } from "./logic/game.logic.shoot";
import { resetStatDisplays, startStatDisplay, stopStatDisplay } from "./visuals/game.visuals.stat-display";
import { createGameInstance, resetGameInstance } from "./logic/game.logic.instance-creator";
import { GAME_MODE } from "./settings/i/game.settings.e.game-modes";
import { GameTransitions } from "./i/game.i.game-transitions";
import { holdBubble } from "./logic/game.logic.bubble-manager";
import { network_setupGame, network_synchronizeGame, submitGameToDB } from "./network/game.network.game";
import { digMod, precisionMod, randomnessMod } from "./settings/ref/game.settings.ref.all-mods";
import { GameSettings } from "./settings/i/game.settings.i.game-settings";
import { HandlingSettings } from "./settings/i/game.settings.i.handling-settings";
import { GARBAGE_CLEAN_AMOUNT, COLLISION_DETECTION_FACTOR, GRID_EXTRA_HEIGHT, GRID_HEIGHT, GRID_WIDTH, MAX_ANGLE, GARBAGE_MAX_AT_ONCE, MIN_ANGLE, QUEUE_PREVIEW_SIZE, REFILL_AMOUNT, WIDTH_PRECISION_UNITS, GARBAGE_COLOR_AMOUNT, COUNTDOWN_DURATION } from "./settings/ref/game.settings.ref.all-game-settings";
import { DEFAULT_APS, TOGGLE_APS } from "./settings/ref/game.settings.ref.all-handling-settings";
import eventBus from "../page/page.event-bus";
import { getNextSeed } from "./logic/game.logic.random";
import { GAME_INPUT } from "./network/dto/game.network.dto.game-input";
import { InputFrame } from "./i/game.i.game-state-history";
import { GameVisuals } from "./visuals/i/game.visuals.i.game-visuals";
import { ref } from "vue";
import { createStatGraphData } from "./logic/game.logic.stat-tracker";

export const playerGameVisuals: GameVisuals = {
    asciiBoard: {
        playGridASCII: ref(""),
        holdString: ref(""),
        queueString: ref(""),
        incomingGarbage: ref(""),
    },
    statNumbers: {
        formattedCurrentTime: ref(""),
        bubbleClearToWin: ref(0),
        bubblesCleared: ref(0),
        bubblesLeftToClear: ref(0),
        bubblesShot: ref(0),
        bubblesPerSecond: ref(0),
    }
};
export let playerGameInstance: GameInstance;
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
    const startSeed = getNextSeed(Date.now());
    playerGameInstance = createGameInstance(gameMode, gameSettings, handlingSettings, transitions, startSeed);
    network_setupGame(playerGameInstance)

    function startSprint(): void {
        enableResetInput();
        disableChannelInput();
        showCountDownAndStart();
    }
    function resetSprint(): void {
        disableGameplay();
        resetGameInstance(playerGameInstance, getNextSeed(Date.now()));
        showCountDownAndStart();
    }
    function leaveSprint(): void {
        disableResetInput();
        enableChannelInput();
        disableGameplay();
    }
    function sprintVictory(): void {
        disableGameplay();
        showASCIIVictory(playerGameInstance, playerGameVisuals.asciiBoard);
        eventBus.emit("sprintVictory");
        submitGameToDB(playerGameInstance.stats);
    }
    function sprintDeath(): void {
        disableGameplay();
        showASCIIDefeat(playerGameInstance, playerGameVisuals.asciiBoard);
    }
}

function getSprintSettings(): GameSettings {
    const floating = !precisionMod.enabled;
    const filled = digMod.enabled;
    const bagSize = randomnessMod.selected;
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
        return 3;
    } else if (!floating && filled) {
        return 3;
    } else if (floating && !filled) {
        return 3;
    } else {
        return 3;
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
    resetStatDisplays(playerGameVisuals.statNumbers);
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
    createStatGraphData(playerGameInstance);
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
    const inputFrame: InputFrame = {
        indexID: playerGameInstance.gameStateHistory.inputHistory.length,
        frameTime: performance.now() - playerGameInstance.stats.gameStartTime,
        input: GAME_INPUT.SHOOT,
        angle: playerGameInstance.angle,
    }
    playerGameInstance.gameStateHistory.inputHistory.push(inputFrame);
    executeShot(playerGameInstance);
    network_synchronizeGame(playerGameInstance);
}
export function triggerHold(): void {
    const inputFrame: InputFrame = {
        indexID: playerGameInstance.gameStateHistory.inputHistory.length,
        frameTime: performance.now() - playerGameInstance.stats.gameStartTime,
        input: GAME_INPUT.HOLD,
        angle: playerGameInstance.angle,
    }
    playerGameInstance.gameStateHistory.inputHistory.push(inputFrame);
    holdBubble(playerGameInstance);
    network_synchronizeGame(playerGameInstance);
}
export function debugTriggerGarbage(): void {
    playerGameInstance.queuedGarbage += 1;
}