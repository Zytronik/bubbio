import state from "../networking/networking.client-websocket";
import { GAME_MODE } from "./i/gameplay.i.stats";

export function setupGame(): void {
    if (state.socket) {
        state.socket.emit("setupGame", GAME_MODE.SPRINT);
    } else {
        console.error("ohno, something went wrong");
    }
}