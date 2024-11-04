import { INPUT_CONTEXT } from '@/ts/_constant/inputContext';
import { channelInput } from '@/ts/input/allInputs';
import { attachInputReader } from '@/ts/input/inputReader';
import { defineStore } from 'pinia';
import { usePageStore } from './pageStore';
import { playCountdown } from '@/ts/animationPixi/countdown';

export const useInputStore = defineStore('input', {
  state: () => ({
    hasAttached: false,
    context: INPUT_CONTEXT.MENU,
  }),
  actions: {
    setInputContext(inputContext: INPUT_CONTEXT) {
      this.context = inputContext;
    },
    setupInputReader(): void {
      if (!this.hasAttached) {
        this.hasAttached = true;
        attachInputReader();
        // channelInput.fire = usePageStore().toggleCommunityOverlayAnimation;
        channelInput.fire = playCountdown;
      }
    },
  },
});
