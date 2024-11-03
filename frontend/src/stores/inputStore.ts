import { INPUT_CONTEXT } from "@/ts/_constant/inputContext";
import { channelInput, shootInput } from "@/ts/input/allInputs";
import { attachInputReader } from "@/ts/input/inputReader";
import { defineStore } from "pinia";
import { openCommunityOverlay } from "@/ts/animation/openCommunityOverlay";
import { playExample } from "@/ts/pixi/animationLoop";

export const useInputStore = defineStore('input', {
    state: () => ({
        hasAttached: false,
        context: INPUT_CONTEXT.GAME_NO_RESET,
    }),
    actions: {
        setInputContext(inputContext: INPUT_CONTEXT) {
            this.context = inputContext;
        },
        setupInputReader(): void {
            if (!this.hasAttached) {
                this.hasAttached = true;
                attachInputReader();
                channelInput.fire = openCommunityOverlay;
                shootInput.fire = playExample;
            }
        },
    },
})