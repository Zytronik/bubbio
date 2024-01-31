import { reactive } from 'vue';

type EventBusCallback = (...args: unknown[]) => void;

export const eventBus = reactive({
  events: {} as Record<string, EventBusCallback[]>,

  setShowLogin: null as ((show: boolean) => void) | null,

  emit(event: string, ...args: unknown[]) {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  },

  on(event: string, callback: EventBusCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },

  off(event: string, callback?: EventBusCallback) {
    if (!this.events[event]) return;
    if (!callback) {
      this.events[event] = [];
    } else {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  },
});
