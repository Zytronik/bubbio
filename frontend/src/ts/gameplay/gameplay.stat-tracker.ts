import { Ref, ref } from "vue";
import { fireGameWinEvent, getSelectedGameMode } from "./gameplay.game-master";
import { GAME_MODE, GameStats } from "./i/gameplay.i.stats";
import { httpClient } from "../networking/networking.http-client";

export const formattedCurrentTime: Ref<string> = ref("");
export const bubbleClearToWin: Ref<number> = ref(0);
export const bubblesCleared: Ref<number> = ref(0);
export const bubblesLeftToClear: Ref<number> = ref(0);
export const bubblesShot: Ref<number> = ref(0);
export const bubblesPerSecond: Ref<number> = ref(0);

let trackingFrameId: number | null = null;
let statTrackingRunning = false;

const gameStats: GameStats = {
    gameStartTime: 0,
    gameEndTime: 0,
    currentTime: 0,
    formattedCurrentTime: "00:00.00",
    bubbleClearToWin: Infinity,
    bubblesCleared: 0,
    bubblesLeftToClear: 0,
    bubblesShot: 0,
    bubblesPerSecond: 0,
    bubbleClearStats: [],
    highestBubbleClear: 0,
    wallBounces: 0,
    wallBounceClears: 0,
    currentCombo: 0,
    highestCombo: 0,
    keysPressed: 0,
    keysPerSecond: 0,
    keysPerBubble: 0,
    angleChanged: 0,
    angleChangePerBubble: 0,
    holds: 0
}

export function startStatTracking(): void {
    if (!statTrackingRunning) {
        statTrackingRunning = true;
        resetGameStats();
        updateStats();
    }
}

export function stopStatTracking(): void {
    if (gameStats.gameEndTime === 0) {
        gameStats.gameEndTime = performance.now()
    }
    if (statTrackingRunning && trackingFrameId !== null) {
        statTrackingRunning = false;
        cancelAnimationFrame(trackingFrameId);
        trackingFrameId = null;
    }
}

function resetGameStats(): void {
    gameStats.gameStartTime = performance.now();
    gameStats.gameEndTime = 0;
    gameStats.currentTime = 0;
    gameStats.formattedCurrentTime = "00:00.00";
    gameStats.bubbleClearToWin = getSelectedGameMode() === GAME_MODE.SPRINT ? 100 : Infinity;
    gameStats.bubblesCleared = 0;
    gameStats.bubblesLeftToClear = gameStats.bubbleClearToWin;
    gameStats.bubblesShot = 0;
    gameStats.bubblesPerSecond = 0;
    gameStats.bubbleClearStats = [];
    gameStats.highestBubbleClear = 0;
    gameStats.wallBounces = 0;
    gameStats.wallBounceClears = 0;
    gameStats.currentCombo = 0;
    gameStats.highestCombo = 0;
    gameStats.keysPressed = 0;
    gameStats.keysPerSecond = 0;
    gameStats.keysPerBubble = 0;
    gameStats.angleChanged = 0;
    gameStats.angleChangePerBubble = 0;
    gameStats.holds = 0;
}

function updateStats(): void {
    gameStats.currentTime = performance.now() - gameStats.gameStartTime;
    gameStats.formattedCurrentTime = formatTimeNumberToString(gameStats.currentTime);

    gameStats.bubblesLeftToClear = gameStats.bubbleClearToWin - gameStats.bubblesCleared;
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
        trackingFrameId = requestAnimationFrame(() => updateStats());
    }
}

export function formatTimeNumberToString(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hundredths = Math.floor((milliseconds % 1000) / 10);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;

    return formattedTime;
}

export function trackBubbleShot(wallBounces: number, amountCleared: number): void {
    gameStats.bubblesShot++;
    gameStats.wallBounces += wallBounces;

    if (amountCleared > 0) {
        trackClearedBubbles(wallBounces, amountCleared);
    } else {
        breakCombo();
    }

    if (getSelectedGameMode() === GAME_MODE.SPRINT && gameStats.bubblesCleared >= gameStats.bubbleClearToWin) {
        fireGameWinEvent();
    }

    function trackClearedBubbles(wallBounces: number, amountCleared: number) {
        gameStats.currentCombo++;
        gameStats.bubblesCleared += amountCleared;
        gameStats.highestBubbleClear = (gameStats.highestBubbleClear > amountCleared) ? gameStats.highestBubbleClear : amountCleared;
        
        let clearStatIndex = amountCleared;
        if (wallBounces > 0) {
            gameStats.wallBounceClears++;
            clearStatIndex = -1 * clearStatIndex;
        } 
        
        if (!gameStats.bubbleClearStats[clearStatIndex]) {
            gameStats.bubbleClearStats[clearStatIndex] = 1;
        } else {
            gameStats.bubbleClearStats[clearStatIndex]++;
        }
    }

    function breakCombo(): void {
        gameStats.highestCombo = (gameStats.highestCombo > gameStats.currentCombo) ? gameStats.highestCombo : gameStats.currentCombo;
        gameStats.currentCombo = 0;
    }
}

export async function submitGametoDB() {
    const isGuest = sessionStorage.getItem('isGuest');
    if(isGuest !== "true"){
        const submitStats = {
            "sprintTime": Math.floor(gameStats.currentTime),
            "bubblesCleared": gameStats.bubblesCleared,
            "bubblesShot": gameStats.bubblesShot,
            "bubblesPerSecond": gameStats.bubblesPerSecond,
        };
        try {
            const token = localStorage.getItem('authToken');
            const response = await httpClient.post('/sprint/submit', submitStats, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            console.log('Game stats submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting game stats:', error);
        }
    }
}