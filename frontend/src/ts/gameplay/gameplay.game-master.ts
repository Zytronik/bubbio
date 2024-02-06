import { InputReader } from "../input/input.input-reader";
import { StartGameEvent } from "./e/gameplay.e.start-game";
import { PlayerAbortedEvent } from "./e/gamplay.e.player-aborted";
import { PlayerDiedEvent } from "./e/gamplay.e.player-died";
import { PlayerWinEvent } from "./e/gamplay.e.player-win";
import { disableAngleControls, enableAngleControls, setupAngleControls } from "./gameplay.angle";
import { showASCIIDefeat, showASCIIVictory, stopASCIIAnimation } from "./gameplay.ascii-visuals";
import { setupGrid } from "./gameplay.playgrid";
import { disableShootControls, enableShootControls, setupShootControls } from "./gameplay.shoot";

const startGameEvent: StartGameEvent = {
    fire: () => { console.error("startGameEvent has not been initialized yet!"); },
};
export const playerDiedEvent: PlayerDiedEvent = {
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
    setupGrid();
}

export function startGame(): void {
    enableAngleControls();
    enableShootControls();
    startGameEvent.fire();
}

export function leaveGame(): void {
    disableAngleControls();
    disableShootControls();
    playerAbortedEvent.fire();
}

export function setupSprintGame(): void {
    setupGameEssentials();
    startGameEvent.fire = startSprint;
    playerDiedEvent.fire = sprintDeath;
    playerWinEvent.fire = sprintVictory;
    playerAbortedEvent.fire = cancelSprint;
    function startSprint(): void {
        console.log("asdf")
        /*
            reset stat tracking
            reset gamefield
            reset angle
            reset board
            reset queue
        */
    }
    function sprintDeath(): void {
        showASCIIDefeat();
    }
    function sprintVictory(): void {
        showASCIIVictory();
    }
    function cancelSprint(): void {
        stopASCIIAnimation();
    }
}

export function showVictory(): void {
    showASCIIVictory();
}

export function showDefeat(): void {
    showASCIIDefeat();
}