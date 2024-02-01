import { reactive, readonly } from 'vue';

// Define a generic callback type with a flexible argument list
type EventBusCallback<T = unknown> = (...args: T[]) => void;

// Define an interface for storing callbacks by event names
interface EventsRecord {
  [eventName: string]: EventBusCallback[];
}

interface EventBusState {
  showLogin: boolean;
}

// Define the EventBus interface with specific methods
interface EventBus {
  state: Readonly<EventBusState>;
  emit<T = unknown>(event: string, ...args: T[]): void;
  on<T = unknown>(event: string, callback: EventBusCallback<T>): void;
  off(event: string, callback?: EventBusCallback): void;
  setShowLogin(show: boolean): void;
}

const state = reactive<EventBusState>({
  showLogin: false,
});

const events: EventsRecord = reactive({});

const emit: EventBus['emit'] = (event, ...args) => {
  const callbacks = events[event];
  if (callbacks) {
    callbacks.forEach(callback => callback(...args));
  }
};

const on: EventBus['on'] = (event, callback) => {
  if (!events[event]) {
    events[event] = [];
  }
  events[event].push(callback as EventBusCallback);
};

const off: EventBus['off'] = (event, callback) => {
  if (!events[event]) return;
  if (!callback) {
    events[event] = [];
  } else {
    events[event] = events[event].filter(cb => cb !== callback);
  }
};

const setShowLogin: EventBus['setShowLogin'] = (show) => {
  state.showLogin = show;
};

const eventBus: EventBus = {
  state: readonly(state),
  emit,
  on,
  off,
  setShowLogin,
};

export default eventBus;
