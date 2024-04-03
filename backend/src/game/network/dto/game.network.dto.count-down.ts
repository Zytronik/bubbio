import { GAME_MODE } from "src/game/settings/i/game.settings.e.game-modes";
import { GAME_STATE } from "../../i/game.e.state";

export interface dto_CountDown {
    matchID: string,
    gameMode: GAME_MODE,
    countDown: GAME_STATE
}