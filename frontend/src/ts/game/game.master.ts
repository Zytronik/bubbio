import { InputReader } from "../input/input.input-reader";
import { StartGameEvent } from "./e/game.e.start-game";
import { PlayerAbortedEvent } from "./e/game.e.player-aborted";
import { PlayerDiedEvent } from "./e/game.e.player-died";
import { PlayerWinEvent } from "./e/game.e.player-win";
import { disableAngleControls, enableAngleControls, resetAngle, setupAngleControls } from "./logic/game.logic.angle";
import { showASCIIDefeat, showASCIIVictory, startASCIIAnimation, stopASCIIAnimation } from "./visuals/game.logic.visuals.ascii";
import { getBubbleQueue } from "./logic/game.logic.bubble-manager";
import { setupGrid } from "./logic/game.logic.playgrid";
import { disableShootControls, enableShootControls, setupShootControls } from "./logic/game.logic.shoot";
import { startStatTracking, stopStatTracking, submitGametoDB } from "./logic/game.logic.stat-tracker";
import { GAME_MODE } from "./i/game.i.stats";

let selectedGameMode: GAME_MODE = GAME_MODE.NONE;
const startGameEvent: StartGameEvent = {
    fire: () => { console.error("startGameEvent has not been initialized yet!"); },
};
const playerDiedEvent: PlayerDiedEvent = {
    fire: () => { console.error("playerDiedEvent has not been initialized yet!"); },
};
const playerWinEvent: PlayerWinEvent = {
    fire: () => { console.error("playerWinEvent has not been initialized yet!"); },
};
const playerAbortedEvent: PlayerAbortedEvent = {
    fire: () => { console.error("playerAbortedEvent has not been initialized yet!"); },
};

function setupGameEssentials(): void {
    new InputReader();
    setupAngleControls();
    setupShootControls();
}

export function startGame(): void {
    startGameEvent.fire();
}

export function leaveGame(): void {
    disableGameInputs();
    playerAbortedEvent.fire();
}

export function setupSprintGame(): void {
    selectedGameMode = GAME_MODE.SPRINT;
    setupGameEssentials();
    startGameEvent.fire = startSprint;
    playerDiedEvent.fire = sprintDeath;
    playerWinEvent.fire = sprintVictory;
    playerAbortedEvent.fire = cancelSprint;
    
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
        setupGrid();
        resetAngle();
        getBubbleQueue();
        startASCIIAnimation();
        startStatTracking();
        enableGameInputs();
    }
    function sprintDeath(): void {
        disableGameInputs();
        stopASCIIAnimation();
        stopStatTracking();
        showASCIIDefeat();
    }
    function sprintVictory(): void {
        disableGameInputs();
        stopASCIIAnimation();
        stopStatTracking();
        showASCIIVictory();
        submitGametoDB();
    }
    function cancelSprint(): void {
        disableGameInputs();
        //TODO enable menu controls
        stopASCIIAnimation();
        stopStatTracking();
    }
}

export function fireGameWinEvent(): void {
    playerWinEvent.fire();
}

export function firePlayerDiedEvent(): void {
    playerDiedEvent.fire();
}

function disableGameInputs(): void {
    disableAngleControls();
    disableShootControls();
}

function enableGameInputs(): void {
    enableAngleControls();
    enableShootControls();
}

export function getSelectedGameMode(): GAME_MODE {
    return selectedGameMode;
}