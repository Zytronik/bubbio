import { reactive } from "vue";
import { dto_SpectationEntry } from "../network/dto/spectate.dto.spectation-entry";
import { GameVisuals } from "../visuals/i/game.visuals.i.game-visuals";

export const allSpectationEntries = reactive<dto_SpectationEntry[]>([]);
export const playerNameVisualsMap = new Map<string, GameVisuals>();