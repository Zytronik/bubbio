import state from "../../networking/networking.client-websocket";
import { allSpectationEntries } from "../spectate/spectate.spectator";
import { dto_SpectationEntry } from "./dto/spectate.dto.spectation-entry";

const registeredSpectateEvents: Set<string> = new Set();
const spectateEvent = "updateSpectatorEntries";
export function joinSpectatorRoom(): void {
    console.log("joinSpectatorRoom")
    if (state.socket && !registeredSpectateEvents.has(spectateEvent)) {
        state.socket.emit("joinSpectatorRoom");
        state.socket.on(spectateEvent, (data: dto_SpectationEntry[]) => {
            allSpectationEntries.length = 0;
            allSpectationEntries.push(...data);
            console.log(allSpectationEntries)
        });
        registeredSpectateEvents.add(spectateEvent);
    }
}

export function leaveSpectatorRoom(): void {
    console.log("leaveSpectatorRoom")
    if (state.socket) {
        state.socket.emit("leaveSpectatorRoom");
        state.socket.off(spectateEvent);
        registeredSpectateEvents.delete(spectateEvent);
    }
}

export function spectatePlayer(clientID: string): void {
    console.log("soontm");
}