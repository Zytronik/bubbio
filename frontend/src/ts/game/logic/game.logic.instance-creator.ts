import { GameSettings } from "@/ts/settings/i/settings.i.game-settings";
import { GameInstance } from "../i/game.i.game-instance";
import { resetGrid, setupGrid } from "./game.logic.grid-manager";
import { GameStats } from "../i/game.i.stats";
import { HandlingSettings } from "@/ts/settings/i/settings.i.handling-settings";
import { GAME_MODE } from "@/ts/settings/i/settings.i.game-modes";
import { GameTransitions } from "../i/game.i.game-transitions";
import { setupBubbleQueueAndCurrent } from "./game.logic.bubble-manager";

export function createGameInstance(
    gameSettings: GameSettings, gameMode: GAME_MODE, handlingSettings: HandlingSettings, gameTransitions: GameTransitions): GameInstance {
    const startSeed = performance.now();
    const gameInstance: GameInstance = {
        gameMode: gameMode,
        gameSettings: gameSettings,
        handlingSettings: handlingSettings,
        initialSeed: startSeed,

        currentSeed: startSeed,
        angle: 90,
        currentAPS: handlingSettings.defaultAPS.value,
        currentBubble: {
            color: "",
            ascii: "",
            type: 0
        },
        previewQueue: [],
        playGrid: setupGrid(gameSettings),
        stats: getEmptyStats(gameSettings, gameMode),
        
        gameStateHistory: {
            inputHistory: [],
            boardHistory: [],
            bubbleQueueHistory: [],
            angleHistory: []
        },
        gameTransitions: gameTransitions,
    }

    gameInstance.currentSeed = setupBubbleQueueAndCurrent(gameInstance.currentSeed, gameInstance.currentBubble, gameInstance.previewQueue, gameInstance.gameSettings.queuePreviewSize.value)

    return gameInstance;
}

export function resetGameInstance(gameInstance: GameInstance): void {
    const seed = performance.now();
    gameInstance.initialSeed = seed;
    gameInstance.currentSeed = seed;
    gameInstance.angle = 90;
    gameInstance.currentAPS = gameInstance.handlingSettings.defaultAPS.value;
    gameInstance.currentBubble = {
        color: "",
        ascii: "",
        type: 0
    };
    gameInstance.previewQueue = [];
    resetGrid(gameInstance.playGrid);
    gameInstance.stats = getEmptyStats(gameInstance.gameSettings, gameInstance.gameMode);
    gameInstance.currentSeed = setupBubbleQueueAndCurrent(gameInstance.currentSeed, gameInstance.currentBubble, gameInstance.previewQueue, gameInstance.gameSettings.queuePreviewSize.value)
}

function getEmptyStats(gameSettings: GameSettings, gameMode: GAME_MODE): GameStats {
    const bubbleCountToWin = (gameMode === GAME_MODE.SPRINT) ? gameSettings.sprintClearAmount.value : Infinity;
    const stats: GameStats = {
        gameStartTime: 0,
        gameEndTime: 0,
        gameDuration: 0,
        currentTime: 0,
        formattedCurrentTime: "00:00.00",
        bubbleClearToWin: bubbleCountToWin,
        bubblesCleared: 0,
        bubblesLeftToClear: bubbleCountToWin,
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
    return stats;
}