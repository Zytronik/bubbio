import { GAME_MODE, GameSettings } from "./game.i.game-settings";
import { Bubble } from "./game.i.bubble";
import { GameStateHistory } from "./game.i.game-state-history";
import { Grid } from "./game.i.grid";
import { GameStats } from "./game.i.stats";
import { GameTransitions } from "./game.i.game-transitions";

export interface GameInstance {
    playerID: string,
    roomID: string,
    opponents: string[],
    gameMode: GAME_MODE,
    gameSettings: GameSettings,
    initialSeed: number,

    currentSeed: number,
    angle: number,
    currentBubble: Bubble,
    heldBubble?: Bubble,
    previewQueue: Bubble[],
    playGrid: Grid,
    stats: GameStats,

    gameStateHistory: GameStateHistory,
    isProcessingInputs: boolean,

    gameTransitions: GameTransitions,
}