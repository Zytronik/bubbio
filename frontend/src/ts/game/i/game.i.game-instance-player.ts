import { GameSettings } from "./game.i.game-settings";
import { Bubble } from "./game.i.bubble";
import { GameStateHistory } from "./game.i.game-state-history";
import { Grid } from "./game.i.grid";
import { GAME_MODE, GameStats } from "./game.i.stats";

export interface PlayerGameInstance {
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

    onGameStart: () => void,
    onGameAbort: () => void,
    onGameVictory: () => void,
    onGameDefeat: () => void,
}