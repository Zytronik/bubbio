import state from "../../network/networking.client-websocket";
import { dto_GameInstance } from "../../_dto/game.network.dto.game-instance";

const DI_GET_ONGOING_GAMES = "debugInput_getAllOngoingGames";
const DO_GET_ONGOING_GAMES = "debugOutput_getAllOngoingGames";
const DI_CLEAR_ONGOING_GAMES = "debugInput_clearAllOngoingGames";

const registeredDebugEvents: Set<string> = new Set();
export function network_getOngoingGames(): void {
    console.log(DI_GET_ONGOING_GAMES);
    if (state.socket) {
        state.socket.emit(DI_GET_ONGOING_GAMES);
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}

export function network_clearOngoingGames(): void {
    console.log(DI_CLEAR_ONGOING_GAMES);
    if (state.socket) {
        state.socket.emit(DI_CLEAR_ONGOING_GAMES);
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}

export function setupDebugListeners() {
    if (state.socket && !registeredDebugEvents.has(DO_GET_ONGOING_GAMES)) {
        state.socket.on(DO_GET_ONGOING_GAMES, (data: dto_GameInstance[]) => {
            console.log(DO_GET_ONGOING_GAMES, data);
        });
        registeredDebugEvents.add(DO_GET_ONGOING_GAMES);
    }
}