import io, { ManagerOptions, SocketOptions, Socket } from 'socket.io-client';
import { reactive } from 'vue';
import { isLocal, socketIoHost } from './paths';
import eventBus from '../page/page.event-bus';

interface StateType {
    socket: Socket | null;
    isConnected: boolean;
    connectionError: string | null;
}
const state: StateType = reactive({
    socket: null,
    isConnected: false,
    connectionError: null
});


const onConnectCallbacks: (() => void)[] = [];

export const addSocketConnectListener = (callback: () => void) => {
    onConnectCallbacks.push(callback);
    // Immediately invoke the callback if the socket is already connected
    if (state.socket && state.socket.connected) {
        callback();
    }
};

const executeOnConnectCallbacks = () => {
    onConnectCallbacks.forEach(callback => callback());
};

export const initializeGlobalSocket = (): void => {
    if (!state.socket) {
        state.socket = initializeSocket();
    }
}

export const disconnectGlobalSocket = (): void => {
    if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
        state.isConnected = false;
        state.connectionError = 'Disconnected';
    }
}

export default state;

function initializeSocket(): Socket {
    // Define default server URL and options
    const ioOptions: Partial<ManagerOptions & SocketOptions> = {
        transports: ['websocket'],
        path: "/blubbio-backend/socket.io",
        query: {
            token: localStorage.getItem('authToken'),
            isGuest: sessionStorage.getItem('isGuest'),
            guestUsername: sessionStorage.getItem('guestUsername'),
        },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 3000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5
    };

    if (isLocal) {
        ioOptions.path = "";
    }

    const socket = io(socketIoHost, ioOptions);
    socket.connect();

    socket.on('connect', () => {
        state.isConnected = true;
        state.connectionError = null;
        executeOnConnectCallbacks();
        eventBus.emit('show-info-message', { message: 'Connected to Server', type: 'success' });
    });

    socket.on('disconnect', () => {
        state.isConnected = false;
        state.connectionError = 'Disconnected';
        eventBus.emit('show-info-message', { message: 'Disconnected from Server', type: 'error' });
    });

    socket.on('connect_error', (error: Error) => {
        state.connectionError = `Connection Failed: ${error.message}`;
        eventBus.emit('show-info-message', { message: 'Reconnection to Server Failed', type: 'error' });
    });

    socket.on('reconnect', () => {
        state.connectionError = 'Reconnected successfully';
        eventBus.emit('show-info-message', { message: 'Reconnected successfully to Server', type: 'success' });
    });

    return socket;
}

export function reconnectGlobalSocket(): void {
    // Disconnect existing socket
    disconnectGlobalSocket();

    // Reinitialize the socket with new parameters
    state.socket = initializeSocket();
}