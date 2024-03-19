import { GAME_MODE } from "../settings/i/game.settings.e.game-modes";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { HandlingSettings } from "../settings/i/game.settings.i.handling-settings";
import { Bubble } from "./game.i.bubble";
import { GameStateHistory } from "./game.i.game-state-history";
import { GameTransitions } from "./game.i.game-transitions";
import { Grid } from "./game.i.grid";
import { GameStats } from "./game.i.game-stats";

export interface GameInstance {
    gameMode: GAME_MODE,
    gameSettings: GameSettings,
    handlingSettings: HandlingSettings,
    initialSeed: number,

    bubbleSeed: number,
    garbageSeed: number,
    angle: number,
    currentAPS: number,
    currentBubble: Bubble,
    holdBubble?: Bubble,
    bubbleQueue: Bubble[],
    playGrid: Grid,
    queuedGarbage: number,
    stats: GameStats,

    gameStateHistory: GameStateHistory,

    gameTransitions: GameTransitions,
}