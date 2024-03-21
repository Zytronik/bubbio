import { dto_GameInstance } from "./network/dto/game.network.dto.game-instance";
import { dto_SpectationEntry } from "./network/dto/game.network.dto.spectation-entry";

export const allSpectationEntries: dto_SpectationEntry[] = [];
export const spectatedGameInstances: dto_GameInstance[] = [];

export function spectatePlayer(clientID: string): void {
    console.log("soontm")
}