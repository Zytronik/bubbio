import state from "../../networking/networking.client-websocket";
import { dto_GameInstance } from "./dto/game.network.dto.game-instance";
import { dto_SpectationEntry } from "./dto/spectate.dto.spectation-entry";

const registeredDebugEvents: Set<string> = new Set();
export function network_getOngoingGames(): void {
    console.log("network_getOngoingGames");
    if (state.socket) {
        state.socket.emit("getOngoingGames");
    }
}

export function network_getSpectationEntries(): void {
    console.log("network_getSpectationEntries");
    if (state.socket) {
        state.socket.emit("getSpectationEntries");
    }
}

export function network_clearOngoingGames(): void {
    console.log("network_clearOngoingGames");
    if (state.socket) {
        state.socket.emit("clearOngoingGames");
    }
}

export function setupDebugListeners() {
    const returnAllGames = "returnAllOngoingGames";
    const spectateGame = "updateGameInstaceForSpectators";
    if (state.socket && !registeredDebugEvents.has(returnAllGames)) {
        state.socket.on(returnAllGames, (data: any) => {
            console.log(returnAllGames, data);
        });
        registeredDebugEvents.add(returnAllGames);
    }
    if (state.socket && !registeredDebugEvents.has(spectateGame)) {
        console.log("todo register to spectate", "state.socket.id");
        state.socket.on(spectateGame, (data: dto_GameInstance) => {
            console.log(spectateGame, data.gameInstance);
        });
        registeredDebugEvents.add(spectateGame);
    }
}