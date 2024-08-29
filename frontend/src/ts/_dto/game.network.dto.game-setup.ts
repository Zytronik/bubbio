import { GAME_MODE } from "../_constant/game.settings.e.game-modes";
import { GameSettings } from "../_interface/game.settings.i.game-settings";

export interface dto_GameSetup {
    gameMode: GAME_MODE;
    gameSettings: GameSettings;
    seed: number;
    matchID: string;
}