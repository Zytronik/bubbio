import { GAME_STATE } from "../../i/game.e.state";
import { GAME_MODE } from "../../settings/i/game.settings.e.game-modes";

export interface dto_CountDown {
    matchID: string,
    gameMode: GAME_MODE,
    countDown: GAME_STATE
}