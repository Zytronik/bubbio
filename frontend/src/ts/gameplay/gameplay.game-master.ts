import { InputReader } from "../input/input.input-reader";
import { PlayerAbortedEvent } from "./e/gamplay.e.player-aborted";
import { PlayerDiedEvent } from "./e/gamplay.e.player-died";
import { PlayerWinEvent } from "./e/gamplay.e.player-win";
import { setupAngleControls } from "./gameplay.angle";
import { setupGrid } from "./gameplay.playgrid";
import { setupShootControls } from "./gameplay.shoot";

const playerDiedEvent: PlayerDiedEvent = {
    fire: () => {},
};
const playerWinEvent: PlayerWinEvent = {
    fire: () => {},
};
const playerAbortedEvent: PlayerAbortedEvent = {
    fire: () => {},
}

function setupGameEssentials(): void {
    new InputReader();
    setupAngleControls();
    setupShootControls();
    setupGrid();
}

function startGame(): void {
    
}

export function setupSprintGame(): void {
    setupGameEssentials();
    playerDiedEvent.fire = sprintDeath;
    playerWinEvent.fire = sprintVictory;
    playerAbortedEvent.fire = cancelSprint;
    function sprintDeath(): void {

    }
    function sprintVictory(): void {

    }
    function cancelSprint(): void {

    }
}