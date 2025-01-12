import { Ref } from "vue";

export interface NetworkEvaluation {
    totalMatches: Ref<number>,
    totalMismatches: Ref<number>,
    inputErrors: Ref<string>,
    boardErrors: Ref<string>,
    queueErrors: Ref<string>,
    angleErrors: Ref<string>,
}