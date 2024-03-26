import { Ref } from "vue";

export interface AsciiBoardRefs {
    playGridASCII: Ref<string>,
    holdString: Ref<string>,
    queueString: Ref<string>,
    incomingGarbage: Ref<string>,
}