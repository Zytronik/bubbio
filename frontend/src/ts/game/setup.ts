import { GAME_MODE } from "../_enum/gameMode";
import { Game } from "../_interface/game/game";
import { GameInstance } from "../_interface/game/gameInstance";
import { UserSession } from "../_interface/userSession";

export function setupEmptyGame(): Game {
    return {
        gameMode: GAME_MODE.NONE,
        spectating: false,
        rounds: [],
        instancesMap: new Map<UserSession, GameInstance>()
    }
}