import { showASCIIDefeat, showASCIIVictory, startASCIIAnimation, stopASCIIAnimation } from "./visuals/game.visuals.ascii";
import { GameInstance } from "./i/game.i.game-instance";
import { disableGameInputs, disableResetInput, enableGameInputs, enableResetInput } from "../input/input.input-manager";
import { cleanUpAngle } from "./logic/game.logic.angle";
import { angleLeftInput, angleRightInput } from "../input/input.possible-inputs";
import { GameStats } from "./i/game.i.game-stats";
import { Bubble } from "./i/game.i.bubble";
import { Grid } from "./i/game.i.grid";
import { calculatePreview, shootBubble } from "./logic/game.logic.shoot";
import { startStatDisplay, stopStatDisplay } from "./visuals/game.visuals.stat-display";
import { createGameInstance, resetGameInstance } from "./logic/game.logic.instance-creator";
import { allGameSettings } from "./settings/game.settings.game";
import { GAME_MODE } from "./settings/i/game.settings.i.game-modes";
import { allHandlingSettings } from "./settings/game.settings.handling";
import { GameTransitions } from "./i/game.i.game-transitions";
import { GameSettings } from "./settings/i/game.settings.i.game-settings";
import { receiveGarbage, holdBubble, updateBubbleQueueAndCurrent } from "./logic/game.logic.bubble-manager";
import { backendSetupGame, submitGameToDB } from "./network/game.network-commands";
import { digMod, precisionMod } from "./settings/game.settings.all-mods";

let playerGameInstance: GameInstance;
export function setupSprintGame(): void {
    const sprintType = getSprintGameMode();
    const transitions: GameTransitions = {
        onGameStart: startSprint,
        onGameReset: resetSprint,
        onGameAbort: leaveSprint,
        onGameDefeat: sprintDeath,
        onGameVictory: sprintVictory
    }

    applyGameSettingsRefNumbers(allGameSettings);
    playerGameInstance = createGameInstance(allGameSettings, sprintType, allHandlingSettings, transitions);
    backendSetupGame(GAME_MODE.SPRINT_R1, allGameSettings, allHandlingSettings)

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
        submitGameToDB(playerGameInstance.stats);
    }
    function sprintDeath(): void {
        disableGameplay();
        showASCIIDefeat();
    }
}

function applyGameSettingsRefNumbers(gameSettings: GameSettings): void {
    gameSettings.gridWidth.value = gameSettings.gridWidth.refValue;
    gameSettings.gridHeight.value = gameSettings.gridHeight.refValue;
    gameSettings.gridExtraHeight.value = gameSettings.gridExtraHeight.refValue;
    gameSettings.minAngle.value = gameSettings.minAngle.refValue;
    gameSettings.maxAngle.value = gameSettings.maxAngle.refValue;
    gameSettings.widthPrecisionUnits.value = gameSettings.widthPrecisionUnits.refValue;
    gameSettings.collisionDetectionFactor.value = gameSettings.collisionDetectionFactor.refValue;
    gameSettings.clearFloatingBubbles.value = precisionMod.enabled.value;
    gameSettings.prefillBoard.value = digMod.enabled.value;
    gameSettings.refillBoardAtLine.value = gameSettings.refillBoardAtLine.refValue;
    gameSettings.refillAmount.value = gameSettings.refillAmount.refValue;
    gameSettings.queuePreviewSize.value = gameSettings.queuePreviewSize.refValue;
    gameSettings.bubbleBagSize.value = gameSettings.bubbleBagSize.refValue;
    gameSettings.garbageMaxAtOnce.value = gameSettings.garbageMaxAtOnce.refValue;
    gameSettings.garbageCleanAmount.value = gameSettings.garbageCleanAmount.refValue;
    gameSettings.garbageColorAmount.value = gameSettings.garbageColorAmount.refValue;
}

function getSprintGameMode(): GAME_MODE {
    const floating: boolean = digMod.enabled.value;
    const filled: boolean = precisionMod.enabled.value;

    if (floating && filled) {
        return GAME_MODE.SPRINT_R1;
    } else if (!floating && filled) {
        return GAME_MODE.SPRINT_R2;
    } else if (floating && !filled) {
        return GAME_MODE.SPRINT_R3;
    } else {
        return GAME_MODE.SPRINT_R4;
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
    startASCIIAnimation();
    startStatDisplay();
    enableGameInputs();
    playerGameInstance.stats.gameStartTime = performance.now();
}
function disableGameplay(): void {
    const stats = playerGameInstance.stats;
    stats.gameEndTime = performance.now();
    stats.gameDuration = stats.gameEndTime - stats.gameStartTime;
    stats.bubblesPerSecond = Number((stats.bubblesShot / stats.gameDuration * 1000).toFixed(2));
    //save playtime/score
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
    playerGameInstance.currentAPS = playerGameInstance.handlingSettings.toggleAPS.value;
}
export function revertAPS(): void {
    playerGameInstance.currentAPS = playerGameInstance.handlingSettings.defaultAPS.value;
}
export function triggerShoot(): void {
    shootBubble(playerGameInstance);
    receiveGarbage(playerGameInstance);
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
export function getIncomingGarbageAmount(): number {
    return playerGameInstance.queuedGarbage;
}