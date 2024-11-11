import { GAME_MODE } from "../_enum/gameMode";
import { Game } from "../_interface/game/game";
import { GameInstance } from "../_interface/game/gameInstance";
import { GameStats } from "../_interface/game/gameStats";
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

export function getEmptyRoundData(): RoundData {
    return {
        initialSeed: getNextSeed(Date.now()),
        gameStartTime: 0,
    }
}

export function getEmptyStats(): GameStats {
    return {
        bubblesShot: 0,
        bubblesCleared: 0,
        attack: 0,
        clears: [[]],
        perfectClears: 0,
        currentCombo: 0,
        highestCombo: 0
    }
}

// export function getNewSprintInstance(): GameInstance {
//     return {
//         bubbleSeed: 0,
//         garbageSeed: 0,
//         angle: 0,
//         currentBubble: undefined,
//         bubbleQueue: [],
//         playGrid: undefined,
//         queuedGarbage: undefined,
//         stats: getEmptyStats(),
//         animationContainer: undefined,
//         instanceAnimations: []
//     }
// }

