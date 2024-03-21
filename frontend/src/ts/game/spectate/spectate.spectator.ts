import { reactive } from "vue";
import { dto_GameInstance } from "../network/dto/game.network.dto.game-instance";
import { dto_SpectationEntry } from "../network/dto/spectate.dto.spectation-entry";

export const allSpectationEntries = reactive<dto_SpectationEntry[]>([]);
export const spectatedGameInstances: dto_GameInstance[] = [];