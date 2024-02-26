import { HandlingSettings } from "@/ts/settings/i/settings.i.handling-settings";
import { GameSettings } from "../../settings/i/settings.i.game-settings";
import { Bubble } from "./game.i.bubble";
import { GameStateHistory } from "./game.i.game-state-history";
import { Grid } from "./game.i.grid";
import { GameStats } from "./game.i.stats";
import { GAME_MODE } from "@/ts/settings/i/settings.i.game-modes";
import { GameTransitions } from "./game.i.game-transitions";

export interface GameInstance {
    gameMode: GAME_MODE,
    gameSettings: GameSettings,
    handlingSettings: HandlingSettings,
    initialSeed: number,

    currentSeed: number,
    angle: number,
    currentAPS: number,
    currentBubble: Bubble,
    heldBubble?: Bubble,
    previewQueue: Bubble[],
    playGrid: Grid,
    stats: GameStats,

    gameStateHistory: GameStateHistory,

    gameTransitions: GameTransitions,
}