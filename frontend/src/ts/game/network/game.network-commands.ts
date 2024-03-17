import { GAME_MODE } from "@/ts/game/settings/i/game.settings.i.game-modes";
import state from "../../networking/networking.client-websocket";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { HandlingSettings } from "../settings/i/game.settings.i.handling-settings";
import { httpClient } from "../../networking/networking.http-client";
import { GameStats } from "../i/game.i.game-stats";
import { nd_GameSetup } from "./i/game.network.i.game-setup-data";
import eventBus from "@/ts/page/page.event-bus";

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
            "bubbleClearStats": JSON.stringify(gameStats.bubbleClearStats),
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
        try {
            const token = localStorage.getItem('authToken');
            await httpClient.post('/sprint/submit', submitStats, {
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