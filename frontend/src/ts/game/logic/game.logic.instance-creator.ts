import { GameInstance } from "../i/game.i.game-instance";
import { resetGrid, setupGrid } from "./game.logic.grid-manager";
import { GameStats } from "../i/game.i.game-stats";
import { GameTransitions } from "../i/game.i.game-transitions";
import { updateBubbleQueueAndCurrent } from "./game.logic.bubble-manager";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { GAME_MODE, SprintAmountMap } from "../settings/i/game.settings.i.game-modes";
import { HandlingSettings } from "../settings/i/game.settings.i.handling-settings";
import { getNextSeed } from "./game.logic.random";

export function createGameInstance(
    gameSettings: GameSettings, gameMode: GAME_MODE, handlingSettings: HandlingSettings, gameTransitions: GameTransitions): GameInstance {
    const startSeed = getNextSeed(Date.now());
    const gameInstance: GameInstance = {
        gameMode: gameMode,
        gameSettings: gameSettings,
        handlingSettings: handlingSettings,
        initialSeed: startSeed,

        bubbleSeed: startSeed,
        garbageSeed: startSeed,
        angle: 90,
        currentAPS: handlingSettings.defaultAPS.value,
        currentBubble: {
            color: "",
            ascii: "",
            type: 0
        },
        bubbleQueue: [],
        playGrid: setupGrid(gameSettings),
        queuedGarbage: 0,
        stats: getEmptyStats(gameMode),

        gameStateHistory: {
            inputHistory: [],
            boardHistory: [],
            bubbleQueueHistory: [],
            angleHistory: []
        },
        gameTransitions: gameTransitions,
    }

    updateBubbleQueueAndCurrent(gameInstance);
    return gameInstance;
}

export function resetGameInstance(gameInstance: GameInstance): void {
    const seed = performance.now();
    gameInstance.initialSeed = seed;
    gameInstance.bubbleSeed = seed;
    gameInstance.angle = 90;
    gameInstance.currentAPS = gameInstance.handlingSettings.defaultAPS.value;
    gameInstance.currentBubble = {
        color: "",
        ascii: "",
        type: 0
    };
    gameInstance.bubbleQueue = [];
    resetGrid(gameInstance.playGrid);
    gameInstance.stats = getEmptyStats(gameInstance.gameMode);
    updateBubbleQueueAndCurrent(gameInstance);
}

function getEmptyStats(gameMode: GAME_MODE): GameStats {
    const bubbleCountToWin = SprintAmountMap.get(gameMode) ?? Infinity;
    console.log("gameMode", gameMode, "bubbleCountToWin", bubbleCountToWin)
    const stats: GameStats = {
        gameStartTime: 0,
        gameEndTime: 0,
        gameDuration: 0,
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