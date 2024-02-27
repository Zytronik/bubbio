import { GAME_MODE } from "@/ts/game/settings/i/game.settings.i.game-modes";
import state from "../../networking/networking.client-websocket";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { HandlingSettings } from "../settings/i/game.settings.i.handling-settings";
import { httpClient } from "../../networking/networking.http-client";
import { GameStats } from "../i/game.i.stats";
import { nd_GameSetup } from "./i/game.network.i.game-setup-data";

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
            "sprintTime": Math.floor(gameStats.currentTime),
            "bubblesCleared": gameStats.bubblesCleared,
            "bubblesShot": gameStats.bubblesShot,
            "bubblesPerSecond": gameStats.bubblesPerSecond,
        };
        try {
            const token = localStorage.getItem('authToken');
            const response = await httpClient.post('/sprint/submit', submitStats, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            console.log('Game stats submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting game stats:', error);
        }
    }
}