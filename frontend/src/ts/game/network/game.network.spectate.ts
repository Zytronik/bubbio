import state from "../../networking/networking.client-websocket";
import { allSpectationEntries, playerNameVisualsMap } from "../spectate/spectate.spectator";
import { fillAsciiStrings } from "../visuals/game.visuals.ascii";
import { fillStatStrings } from "../visuals/game.visuals.stat-display";
import { getEmptyGameVisuals } from "../visuals/i/game.visuals.i.game-visuals";
import { dto_GameInstance } from "./dto/game.network.dto.game-instance";
import { dto_SpectationEntry } from "./dto/spectate.dto.spectation-entry";

const J_SPECTATOR_ENTRIES = "join_spectatorEntriesRoom";
const L_SPECTATOR_ENTRIES = "leave_spectatorEntriesRoom";
const O_SPECTATOR_ENTRIES = "update_spectatorEntries";

const J_PLAYER_SPECTATOR = "join_playerSpectatorRoom";
const L_PLAYER_SPECTATOR = "leave_playerSpectatorRoom";
const O_PLAYER_SPECTATOR = "update_playerSpectator";

const registeredSpectateEvents: Set<string> = new Set();
const currentlySpectating: Set<string> = new Set();
export function network_joinSpectatorRoom(): void {
    console.log(J_SPECTATOR_ENTRIES);
    if (state.socket && !registeredSpectateEvents.has(O_SPECTATOR_ENTRIES)) {
        state.socket.emit(J_SPECTATOR_ENTRIES);
        state.socket.on(O_SPECTATOR_ENTRIES, (data: dto_SpectationEntry[]) => {
            allSpectationEntries.length = 0;
            allSpectationEntries.push(...data);
        });
        registeredSpectateEvents.add(O_SPECTATOR_ENTRIES);
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}

export function network_leaveSpectatorRoom(): void {
    console.log(L_SPECTATOR_ENTRIES);
    if (state.socket) {
        state.socket.emit(L_SPECTATOR_ENTRIES);
        state.socket.off(O_SPECTATOR_ENTRIES);
        registeredSpectateEvents.delete(O_SPECTATOR_ENTRIES);
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}

export function network_spectatePlayer(clientID: string): void {
    console.log(J_PLAYER_SPECTATOR, clientID);
    if (state.socket && !registeredSpectateEvents.has(O_PLAYER_SPECTATOR)) {
        currentlySpectating.add(clientID);
        state.socket.emit(J_PLAYER_SPECTATOR, clientID);
        state.socket.on(O_PLAYER_SPECTATOR, (data: dto_GameInstance) => {
            if (playerNameVisualsMap.has(data.playerName)) {
                const visuals = playerNameVisualsMap.get(data.playerName);
                if (visuals) {
                    fillAsciiStrings(data.gameInstance, visuals.asciiBoard);
                    fillStatStrings(data.gameInstance, visuals.statNumbers);
                }
            } else {
                const visuals = getEmptyGameVisuals();
                fillAsciiStrings(data.gameInstance, visuals.asciiBoard);
                fillStatStrings(data.gameInstance, visuals.statNumbers);
                playerNameVisualsMap.set(data.playerName, visuals);
            }
            console.log("spectating:" + data.playerName, playerNameVisualsMap.get(data.playerName))
        });
        registeredSpectateEvents.add(O_PLAYER_SPECTATOR);
    } else if (registeredSpectateEvents.has(O_PLAYER_SPECTATOR)) {
        console.error("already spectating", O_PLAYER_SPECTATOR);
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}

export function network_stopSpectating(clientID: string): void {
    console.log(L_PLAYER_SPECTATOR, clientID);
    currentlySpectating.forEach((id) => {
        if (state.socket) {
            state.socket.emit(L_PLAYER_SPECTATOR, id);
            state.socket.off(O_PLAYER_SPECTATOR);
        } else {
            console.error("YOU DONT HAVE ANY SOCKETS!");
        }
        currentlySpectating.delete(clientID);
    });
    registeredSpectateEvents.delete(O_PLAYER_SPECTATOR);
}