import { showASCIIDefeat, showASCIIVictory, startASCIIAnimation, stopASCIIAnimation } from "./visuals/game.visuals.ascii";
import { setupGrid } from "./logic/game.logic.grid-manager";
import { GAME_MODE, GameStats } from "./i/game.i.stats";
import { PlayerGameInstance } from "./i/game.i.game-instance-player";
import { CAN_USE_HOLD, COLLISION_DETECTION_FACTOR, DISSOLVE_FLOATING_BUBBLES, GRID_EXTRA_HEIGHT, GRID_HEIGHT, GRID_WIDTH, MAX_ANGLE, MIN_ANGLE, QUEUE_PREVIEW_SIZE, WIDTH_PRECISION_UNITS } from "../settings/settings.game";
import { Bubble } from "./i/game.i.bubble";
import { Grid } from "./i/game.i.grid";
import { GameSettings } from "./i/game.i.game-settings";
import { disableGameInputs, enableGameInputs, setupGameControls } from "../input/input.input-manager";
import { calculatePreview } from "./logic/game.logic.shoot";
import { startStatTracking, stopStatTracking, submitGametoDB } from "./logic/game.logic.stat-tracker";
import { center } from "./logic/game.logic.angle";
import { setupBubbleQueueAndCurrent } from "./logic/game.logic.bubble-manager";

const playerGameInstance: PlayerGameInstance = {
    gameMode: GAME_MODE.NONE,
    gameSettings: {
        gridWidth: GRID_WIDTH,
        gridHeight: GRID_HEIGHT,
        gridExtraHeight: GRID_EXTRA_HEIGHT,
        minAngle: MIN_ANGLE,
        maxAngle: MAX_ANGLE,
        widthPrecisionUnits: WIDTH_PRECISION_UNITS,
        collisionDetectionFactor: COLLISION_DETECTION_FACTOR,
        dissolveFloatingBubbles: DISSOLVE_FLOATING_BUBBLES,
        canUseHold: CAN_USE_HOLD,
        queuePreviewSize: QUEUE_PREVIEW_SIZE
    },
    initialSeed: 0,
    currentSeed: 0,
    angle: 90,
    currentBubble: {
        color: "",
        ascii: "",
        type: 0
    },
    previewQueue: [],
    playGrid: {
        precisionWidth: 0,
        precisionHeight: 0,
        precisionRowHeight: 0,
        gridWidth: 0,
        gridHeight: 0,
        extraGridHeight: 0,
        rows: [],
        bubbleRadius: 0,
        bubbleLauncherPosition: { x: 0, y: 0 },
        collisionRangeSquared: 0,
        dissolveFloatingBubbles: false
    },
    stats: {
        gameStartTime: 0,
        gameEndTime: 0,
        currentTime: 0,
        formattedCurrentTime: "",
        bubbleClearToWin: 0,
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
    },
    gameStateHistory: {
        inputHistory: [],
        boardHistory: [],
        bubbleQueueHistory: [],
        angleHistory: []
    },
    onGameStart: function (): void {
        throw new Error("Function not implemented.");
    },
    onGameAbort: function (): void {
        throw new Error("Function not implemented.");
    },
    onGameVictory: function (): void {
        throw new Error("Function not implemented.");
    },
    onGameDefeat: function (): void {
        throw new Error("Function not implemented.");
    }
}

export function startGame(): void {
    playerGameInstance.onGameStart();
}

export function leaveGame(): void {
    playerGameInstance.onGameAbort();
}

export function setupSprintGame(): void {
    playerGameInstance.gameMode = GAME_MODE.SPRINT;
    setupGameControls();
    playerGameInstance.onGameStart = startSprint;
    playerGameInstance.onGameAbort = cancelSprint;
    playerGameInstance.onGameVictory = sprintVictory;
    playerGameInstance.onGameDefeat = sprintDeath;

    function startSprint(): void {
        /*
            stop animations
            reset stat tracking
            reset gamefield
            reset angle
            reset queue
            start animations
            enable inputs
            */
        stopASCIIAnimation();
        stopStatTracking();
        playerGameInstance.playGrid = setupGrid();
        center();
        setupBubbleQueueAndCurrent();
        startASCIIAnimation();
        startStatTracking();
        enableGameInputs();
    }
    function cancelSprint(): void {
        disableGameInputs();
        //TODO enable menu controls
        stopASCIIAnimation();
        stopStatTracking();
    }
    function sprintVictory(): void {
        disableGameInputs();
        stopASCIIAnimation();
        stopStatTracking();
        showASCIIVictory();
        submitGametoDB();
    }
    function sprintDeath(): void {
        disableGameInputs();
        stopASCIIAnimation();
        stopStatTracking();
        showASCIIDefeat();
    }
}

export function fireGameWinEvent(): void {
    playerGameInstance.onGameVictory();
}

export function firePlayerDiedEvent(): void {
    playerGameInstance.onGameDefeat();
}

export function getCurrentSeed(): number {
    return playerGameInstance.currentSeed;
}

export function getCurrentBubble(): Bubble {
    return playerGameInstance.currentBubble;
}

export function setCurrentBubble(bubbleToSet: Bubble): void {
    playerGameInstance.currentBubble = bubbleToSet;
}

export function getHeldBubble(): Bubble | undefined {
    return playerGameInstance.heldBubble;
}

export function setHeldBubble(bubbleToSet: Bubble): void {
    playerGameInstance.heldBubble = bubbleToSet;
}

export function getBubbleQueue(): Bubble[] {
    return playerGameInstance.previewQueue;
}

export function updatePreviewBubble(): void {
    calculatePreview();
}

export function getPlayGrid(): Grid {
    return playerGameInstance.playGrid;
}

export function getAngle(): number {
    return playerGameInstance.angle;
}

export function setAngle(angleToSet: number): void {
    playerGameInstance.angle = angleToSet;
}

export function getSelectedGameMode(): GAME_MODE {
    return playerGameInstance.gameMode;
}

export function getGameSettings(): GameSettings {
    return playerGameInstance.gameSettings;
}

export function getGameStats(): GameStats {
    return playerGameInstance.stats;
}

export function triggerGameLost(): void {
    playerGameInstance.onGameDefeat();
}