import { InputFrame } from "src/game/i/game.i.game-state-history";
import { GAME_MODE } from "src/game/settings/i/game.settings.e.game-modes";

export interface dto_Inputs {
    gameMode: GAME_MODE,
    matchID: string,
    inputs: InputFrame[],
}