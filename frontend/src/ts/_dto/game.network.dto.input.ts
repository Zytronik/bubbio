import { InputFrame } from "../_interface/game.i.game-state-history";
import { GAME_MODE } from "../_constant/game.settings.e.game-modes";

export interface dto_Inputs {
    gameMode: GAME_MODE,
    matchID: string,
    inputs: InputFrame[],
}