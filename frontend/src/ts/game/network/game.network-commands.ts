import { GAME_MODE } from "@/ts/game/settings/i/game.settings.e.game-modes";
import state from "../../networking/networking.client-websocket";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { HandlingSettings } from "../settings/i/game.settings.i.handling-settings";
import { httpClient } from "../../networking/networking.http-client";
import { GameStats } from "../i/game.i.game-stats";
import { nd_GameSetup } from "./i/game.network.i.game-setup-data";
import eventBus from "@/ts/page/page.event-bus";
import { allMods } from "../settings/game.settings.all-mods";

export function backendSetupGame(gameMode: GAME_MODE, gameSettings: GameSettings, handlingSettings: HandlingSettings): void {
    if (state.socket) {
        const networkData : nd_GameSetup = {
            gameMode: gameMode,
            gameSettings: gameSettings,
            handlingSettings: handlingSettings
        }
        state.socket.emit("setupGame", networkData);
    } else {
        console.error("ohno, something went wrong");
    }
}

export async function submitGameToDB(gameStats: GameStats) {
    const isGuest = sessionStorage.getItem('isGuest');
    if(isGuest !== "true"){
        const submitStats = {
            "bubbleClearToWin": gameStats.bubbleClearToWin,
            "clear3": gameStats.clear3,
            "clear4": gameStats.clear4,
            "clear5": gameStats.clear5,
            "clear3wb": gameStats.clear3wb,
            "clear4wb": gameStats.clear4wb,
            "clear5wb": gameStats.clear5wb,
            "bubblesCleared": gameStats.bubblesCleared,
            "bubblesShot": gameStats.bubblesShot,
            "bubblesPerSecond": gameStats.bubblesPerSecond,
            "gameDuration": Math.floor(gameStats.gameDuration),
            "highestBubbleClear": gameStats.highestBubbleClear,
            "wallBounces": gameStats.wallBounces,
            "wallBounceClears": gameStats.wallBounceClears,
            "highestCombo": gameStats.highestCombo,
            "keysPressed": gameStats.keysPressed,
            "keysPerSecond": gameStats.keysPerSecond,
            "keysPerBubble": gameStats.keysPerBubble,
            "angleChanged": gameStats.angleChanged,
            "angleChangePerBubble": gameStats.angleChangePerBubble,
            "holds": gameStats.holds
        };
        const mods: Record<string, boolean> = {};
        allMods.forEach(mod => {
            if ('enabled' in mod && typeof mod.enabled === 'boolean') {
                mods[mod.abr] = mod.enabled;
            } else if ('selected' in mod && typeof mod.selected == 'number') {
                mods[mod.abr[mod.modValues.indexOf(mod.selected)]] = true;
            }
        });
        console.log(allMods, mods)
        const modsJsonString = JSON.stringify(mods);
        try {
            const token = localStorage.getItem('authToken');
            await httpClient.post('/sprint/submit', {submitStats, mods: modsJsonString}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            eventBus.emit('show-info-message', { message: 'Sprint submitted successfully.', type: 'success' });
        } catch (error) {
            eventBus.emit('show-info-message', { message: 'There was an error submitting your Sprint.', type: 'error' });
        }
    }
}