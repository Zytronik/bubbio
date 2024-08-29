import { GAME_MODE } from "../_constant/game.settings.e.game-modes";

export interface dto_SpectationEntry {
    playerName: string,
    clientID: string,
    userID: string,
    gameMode: GAME_MODE,
    dig: boolean,
    precision: boolean,
}