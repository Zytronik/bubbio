import { GAME_MODE } from "@/ts/game/settings/i/game.settings.i.game-modes";
import state from "../networking/networking.client-websocket";

export function setupGame(): void {
    if (state.socket) {
        state.socket.emit("setupGame", GAME_MODE.SPRINT);
    } else {
        console.error("ohno, something went wrong");
    }
}