import { Ref, ref } from "vue";
import { AsciiBoardRefs } from "./game.visuals.i.ascii-board";
import { StatNumberRefs } from "./game.visuals.i.stat-numbers";

export interface GameVisuals {
    asciiBoard: AsciiBoardRefs,
    statNumbers: StatNumberRefs,
    timeDifference: number,
    playerName: Ref<string>,
}

export function getEmptyGameVisuals(): GameVisuals {
    return {
        asciiBoard: {
            playGridASCII: ref(""),
            holdString: ref(""),
            queueString: ref(""),
            incomingGarbage: ref(""),
            floatingText: ref(""),
        },
        statNumbers: {
            formattedCurrentTime: ref(""),
            bubbleClearToWin: ref(0),
            bubblesCleared: ref(0),
            bubblesLeftToClear: ref(0),
            bubblesShot: ref(0),
            bubblesPerSecond: ref(0),
            attackPerMinute: ref(0),
            currentCombo: ref(0),
            spikeNumber: ref(""),
            showPC: ref(false),
        },
        timeDifference: 0,
        playerName: ref(""),
    }
}