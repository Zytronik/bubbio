import { GAME_MODE } from "@/ts/game/settings/i/game.settings.i.game-modes";
import state from "../networking/networking.client-websocket";
import { GameSettings } from "./settings/i/game.settings.i.game-settings";
import { HandlingSettings } from "./settings/i/game.settings.i.handling-settings";

export function backendSetupGame(gameMode: GAME_MODE, gameSettings: GameSettings, handlingSettings: HandlingSettings): void {
    if (state.socket) {
        console.log("sending setupGame");
        state.socket.emit("setupGame", gameMode, gameSettings, handlingSettings);
    } else {
        console.error("ohno, something went wrong");
    }
}