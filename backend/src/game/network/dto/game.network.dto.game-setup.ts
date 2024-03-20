import { GAME_MODE } from "../../settings/i/game.settings.e.game-modes";
import { GameSettings } from "../../settings/i/game.settings.i.game-settings";
import { HandlingSettings } from "../../settings/i/game.settings.i.handling-settings";

export interface dto_GameSetup {
    gameMode: GAME_MODE;
    gameSettings: GameSettings;
    handlingSettings: HandlingSettings;
    seed: number;
}