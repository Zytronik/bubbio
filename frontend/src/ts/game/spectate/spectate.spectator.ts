import { reactive } from "vue";
import { dto_SpectationEntry } from "../network/dto/spectate.dto.spectation-entry";
import { GameVisuals } from "../visuals/i/game.visuals.i.game-visuals";
import { formatTimeNumberToString } from "../visuals/game.visuals.stat-display";
import { GameInstance } from "../i/game.i.game-instance";

export const allSpectationEntries = reactive<dto_SpectationEntry[]>([]);
export const playerNameInstanceMap = new Map<string, GameInstance>();
export const playerNameVisualsMap = reactive(new Map<string, GameVisuals>());

let spectatorFrameID: number | null = null;
let spectatingAnimRunning = false;

export function startSpectatorStatDisplay(): void {
    console.log("are you even spectating?")
    if (!spectatingAnimRunning) {
        spectatingAnimRunning = true;
        statDisplayAnimation();
    }
}

export function stopSpectatorStatDisplay(): void {
    if (spectatingAnimRunning && spectatorFrameID !== null) {
        spectatingAnimRunning = false;
        cancelAnimationFrame(spectatorFrameID);
        spectatorFrameID = null;
        updateTimeStats();
    }
}

function statDisplayAnimation(): void {
    updateTimeStats();
    if (spectatingAnimRunning) {
        spectatorFrameID = requestAnimationFrame(() => statDisplayAnimation());
    }
}

function updateTimeStats(): void {
    playerNameVisualsMap.forEach((visuals, playerName) => {
        const playerInstance = playerNameInstanceMap.get(playerName);
        if (playerInstance && playerInstance.stats && visuals && visuals.statNumbers) {
            const currentTime = performance.now() + visuals.timeDifference;
            visuals.statNumbers.formattedCurrentTime = formatTimeNumberToString(currentTime);
            visuals.statNumbers.bubblesPerSecond = Number((visuals.statNumbers.bubblesShot / currentTime * 1000).toFixed(2));
        }
    });
}