import { GAME_MODE } from "../_constant/game.settings.e.game-modes";

export interface dto_AngleUpdate {
    gameMode: GAME_MODE,
    matchID: string,
    angle: number,
    frameTime: number,
}