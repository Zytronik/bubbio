import { GAME_MODE } from "../../settings/i/game.settings.e.game-modes";
import { GameSettings } from "../../settings/i/game.settings.i.game-settings";

export interface dto_GameSetup {
    gameMode: GAME_MODE;
    gameSettings: GameSettings;
    seed: number;
}