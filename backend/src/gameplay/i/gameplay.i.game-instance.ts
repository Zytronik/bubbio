import { GameSettings } from "./gameplay.i-game-settings";
import { Bubble } from "./gameplay.i.bubble";
import { GameStateHistory } from "./gameplay.i.game-state-history";
import { Grid } from "./gameplay.i.grid";
import { GAME_MODE, GameStats } from "./gameplay.i.stats";

export interface GameInstance {
    playerID: string,
    roomID: string,
    opponents: string[],
    gameMode: GAME_MODE,
    gameSettings: GameSettings,
    initialSeed: number,

    currentSeed: number,
    currentBubble: Bubble,
    heldBubble?: Bubble,
    previewQueue: Bubble[],
    playGrid: Grid,
    stats: GameStats,

    gameStateHistory: GameStateHistory,
    isProcessingInputs: boolean,

    onGameVictory: () => void,
    onGameDefeat: () => void,
}