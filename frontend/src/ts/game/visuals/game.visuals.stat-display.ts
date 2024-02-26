import { Ref, ref } from "vue";
import { getGameStats } from "../game.master";

export const formattedCurrentTime: Ref<string> = ref("");
export const bubbleClearToWin: Ref<number> = ref(0);
export const bubblesCleared: Ref<number> = ref(0);
export const bubblesLeftToClear: Ref<number> = ref(0);
export const bubblesShot: Ref<number> = ref(0);
export const bubblesPerSecond: Ref<number> = ref(0);

let trackingFrameId: number | null = null;
let statTrackingRunning = false;

export function startStatDisplay(): void {
    if (!statTrackingRunning) {
        const gameStats = getGameStats();
        statTrackingRunning = true;
        gameStats.gameStartTime = performance.now();
        updateStatDisplay();
    }
}

export function stopStatDisplay(): void {
    const gameStats = getGameStats();
    if (gameStats.gameEndTime === 0) {
        gameStats.gameEndTime = performance.now();
        gameStats.gameDuration = gameStats.gameEndTime - gameStats.gameStartTime;
        gameStats.bubblesPerSecond = Number((gameStats.bubblesShot / gameStats.gameDuration * 1000).toFixed(2));
    }
    if (statTrackingRunning && trackingFrameId !== null) {
        statTrackingRunning = false;
        cancelAnimationFrame(trackingFrameId);
        trackingFrameId = null;
    }
}

function updateStatDisplay(): void {
    const gameStats = getGameStats();
    gameStats.currentTime = performance.now() - gameStats.gameStartTime;
    gameStats.formattedCurrentTime = formatTimeNumberToString(gameStats.currentTime);
    gameStats.bubblesPerSecond = Number((gameStats.bubblesShot / gameStats.currentTime * 1000).toFixed(2));
    //keysPressed
    //keysPerSecond
    //keysPerBubble
    
    //angleChanged
    //angleChangePerBubble

    //holds

    formattedCurrentTime.value = gameStats.formattedCurrentTime;
    bubbleClearToWin.value = gameStats.bubbleClearToWin;
    bubblesCleared.value = gameStats.bubblesCleared;
    bubblesLeftToClear.value = gameStats.bubblesLeftToClear;
    bubblesShot.value = gameStats.bubblesShot;
    bubblesPerSecond.value = gameStats.bubblesPerSecond;

    if (statTrackingRunning) {
        trackingFrameId = requestAnimationFrame(() => updateStatDisplay());
    }
}

function formatTimeNumberToString(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hundredths = Math.floor((milliseconds % 1000) / 10);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;

    return formattedTime;
}