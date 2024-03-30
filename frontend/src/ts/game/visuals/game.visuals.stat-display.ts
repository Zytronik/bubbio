import { playerGameInstance, playerGameVisuals } from "../game.master";
import { GameInstance } from "../i/game.i.game-instance";
import { StatNumberRefs } from "./i/game.visuals.i.stat-numberscopy";

let trackingFrameId: number | null = null;
let statTrackingRunning = false;

export function startStatDisplay(): void {
    if (!statTrackingRunning) {
        statTrackingRunning = true;
        statDisplayAnimation();
    }
}

export function stopStatDisplay(): void {
    if (statTrackingRunning && trackingFrameId !== null) {
        statTrackingRunning = false;
        cancelAnimationFrame(trackingFrameId);
        trackingFrameId = null;
        fillStatStrings(playerGameInstance, playerGameVisuals.statNumbers);
    }
}

function statDisplayAnimation(): void {
    fillStatStrings(playerGameInstance, playerGameVisuals.statNumbers);
    if (statTrackingRunning) {
        trackingFrameId = requestAnimationFrame(() => statDisplayAnimation());
    }
}

export function fillStatStrings(gameInstance: GameInstance, statStrings: StatNumberRefs): void {
    const gameStats = gameInstance.stats;
    const currentTime = performance.now() - gameStats.gameStartTime;
    const formattedCurrentTimeString = formatTimeNumberToString(currentTime);
    gameStats.bubblesPerSecond = Number((gameStats.bubblesShot / currentTime * 1000).toFixed(2));
    //keysPressed
    //keysPerSecond
    //keysPerBubble

    //angleChanged
    //angleChangePerBubble

    //holds

    statStrings.formattedCurrentTime.value = formattedCurrentTimeString;
    statStrings.bubbleClearToWin.value = gameStats.bubbleClearToWin;
    statStrings.bubblesCleared.value = gameStats.bubblesCleared;
    statStrings.bubblesLeftToClear.value = gameStats.bubblesLeftToClear;
    statStrings.bubblesShot.value = gameStats.bubblesShot;
    statStrings.bubblesPerSecond.value = gameStats.bubblesPerSecond;
}

export function resetStatDisplays(statStrings: StatNumberRefs): void {
    statStrings.formattedCurrentTime.value = ("00:00.00");
    statStrings.bubbleClearToWin.value = (0);
    statStrings.bubblesCleared.value = (0);
    statStrings.bubblesLeftToClear.value = (0);
    statStrings.bubblesShot.value = (0);
    statStrings.bubblesPerSecond.value = (0);
}

export function formatTimeNumberToString(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hundredths = Math.floor((milliseconds % 1000) / 10);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
}