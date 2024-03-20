import io, { ManagerOptions, SocketOptions, Socket } from 'socket.io-client';
import { reactive } from 'vue';
import { isLocal, socketIoHost } from './paths';

interface StateType {
    socket: Socket | null;
}

const state: StateType = reactive({
    socket: null
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
        }
    };

    if (isLocal) {
        ioOptions.path = "";
    }

    const socket = io(socketIoHost, ioOptions);
    socket.connect();

    socket.on('connect', () => {
        executeOnConnectCallbacks();
    });

    return socket;
}

export function reconnectGlobalSocket(): void {
    // Disconnect existing socket
    disconnectGlobalSocket();

    // Reinitialize the socket with new parameters
    state.socket = initializeSocket();
}