import { GAME_MODE } from "../../settings/i/game.settings.e.game-modes";

export interface dto_AngleUpdate {
    gameMode: GAME_MODE,
    matchID: string,
    angle: number,
}