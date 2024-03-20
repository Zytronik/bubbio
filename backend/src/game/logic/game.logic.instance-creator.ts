import { GameInstance } from "../i/game.i.game-instance";
import { resetGrid, setupGrid } from "./game.logic.grid-manager";
import { GameStats } from "../i/game.i.game-stats";
import { GameTransitions } from "../i/game.i.game-transitions";
import { updateBubbleQueueAndCurrent } from "./game.logic.bubble-manager";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { GAME_MODE } from "../settings/i/game.settings.e.game-modes";
import { HandlingSettings } from "../settings/i/game.settings.i.handling-settings";
import { getNextSeed } from "./game.logic.random";
import { prefillBoard } from "./game.logic.garbage";

export function createGameInstance(
    gameMode: GAME_MODE,
    gameSettings: GameSettings,
    handlingSettings: HandlingSettings,
    gameTransitions: GameTransitions): GameInstance {

    const startSeed = getNextSeed(Date.now());
    const gameInstance: GameInstance = {
        gameMode: gameMode,
        gameSettings: gameSettings,
        handlingSettings: handlingSettings,
        initialSeed: startSeed,

        bubbleSeed: startSeed,
        garbageSeed: startSeed,
        angle: 90,
        currentAPS: handlingSettings.defaultAPS,
        currentBubble: {
            color: "",
            ascii: "",
            type: 0
        },
        bubbleQueue: [],
        playGrid: setupGrid(gameSettings),
        queuedGarbage: 0,
        stats: getEmptyStats(gameSettings),

        gameStateHistory: {
            inputHistory: [],
            boardHistory: [],
            bubbleQueueHistory: [],
            angleHistory: []
        },
        gameTransitions: gameTransitions,
    }
    if (gameInstance.gameSettings.prefillBoard) {
        prefillBoard(gameInstance);
    }
    updateBubbleQueueAndCurrent(gameInstance);
    return gameInstance;
}

export function resetGameInstance(gameInstance: GameInstance): void {
    const seed = getNextSeed(Date.now());
    gameInstance.initialSeed = seed;
    gameInstance.bubbleSeed = seed;
    gameInstance.angle = 90;
    gameInstance.currentAPS = gameInstance.handlingSettings.defaultAPS;
    gameInstance.currentBubble = {
        color: "",
        ascii: "",
        type: 0
    };
    gameInstance.playGrid.previewBubble = undefined;
    gameInstance.bubbleQueue = [];
    resetGrid(gameInstance.playGrid);
    gameInstance.queuedGarbage = 0;
    gameInstance.stats = getEmptyStats(gameInstance.gameSettings);
    if (gameInstance.gameSettings.prefillBoard) {
        prefillBoard(gameInstance);
    }
    updateBubbleQueueAndCurrent(gameInstance);
}

function getEmptyStats(gameSettings: GameSettings): GameStats {
    const stats: GameStats = {
        gameStartTime: 0,
        gameEndTime: 0,
        gameDuration: 0,
        bubbleClearToWin: gameSettings.sprintVictoryCondition,
        bubblesCleared: 0,
        bubblesLeftToClear: gameSettings.sprintVictoryCondition,
        bubblesShot: 0,
        bubblesPerSecond: 0,
        clear3: 0,
        clear4: 0,
        clear5: 0,
        clear3wb: 0,
        clear4wb: 0,
        clear5wb: 0,
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