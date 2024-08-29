import { GAME_MODE } from "../_constant/game.settings.e.game-modes";
import { GAME_STATE } from "../_constant/game.e.state";

export interface dto_CountDown {
    matchID: string,
    gameMode: GAME_MODE,
    countDown: GAME_STATE
}