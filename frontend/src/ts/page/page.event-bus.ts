import { reactive } from 'vue';

export const eventBus = reactive({
  setShowLogin: null as ((show: boolean) => void) | null,
});
