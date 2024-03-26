import { ref } from "vue";
import { AsciiBoardRefs } from "./game.visuals.i.ascii-board";
import { StatNumberRefs } from "./game.visuals.i.stat-numberscopy";

export interface GameVisuals {
    asciiBoard: AsciiBoardRefs,
    statNumbers: StatNumberRefs
}

export function getEmptyGameVisuals(): GameVisuals {
    return {
        asciiBoard: {
            playGridASCII: ref(""),
            holdString: ref(""),
            queueString: ref(""),
            incomingGarbage: ref("")
        },
        statNumbers: {
            formattedCurrentTime: ref(""),
            bubbleClearToWin: ref(0),
            bubblesCleared: ref(0),
            bubblesLeftToClear: ref(0),
            bubblesShot: ref(0),
            bubblesPerSecond: ref(0)
        }
    }
}