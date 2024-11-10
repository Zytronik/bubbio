import { GAME_MODE } from "../_enum/gameMode";
import { Game } from "../_interface/game/game";
import { GameInstance } from "../_interface/game/gameInstance";
import { RoundData } from "../_interface/game/roundData";
import { UserSession } from "../_interface/userSession";
import { getNextSeed } from "./rng";

export function getEmptyGame(): Game {
    return {
        gameMode: GAME_MODE.NONE,
        spectating: false,
        rounds: [],
        instancesMap: new Map<UserSession, GameInstance>()
    }
}

export function setupEmptyRoundData(): RoundData {
    return {
        initialSeed: getNextSeed(Date.now()),
        gameStartTime: 0,
    }
}

export function getNewSprintInstance(): void {
    // const game: GameInstance = {
    //     bubbleSeed: 0,
    //     garbageSeed: 0,
    //     angle: 0,
    //     currentBubble: undefined,
    //     bubbleQueue: [],
    //     playGrid: undefined,
    //     queuedGarbage: undefined,
    //     stats: undefined,
    //     animationContainer: undefined,
    //     instanceAnimations: []
    // }
}