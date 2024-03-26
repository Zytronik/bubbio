import { Ref } from "vue";

export interface StatNumberRefs {
    formattedCurrentTime: Ref<string>,
    bubbleClearToWin: Ref<number>,
    bubblesCleared: Ref<number>,
    bubblesLeftToClear: Ref<number>,
    bubblesShot: Ref<number>,
    bubblesPerSecond: Ref<number>,
}