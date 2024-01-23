import io, { ManagerOptions, SocketOptions, Socket } from 'socket.io-client';
import { reactive } from 'vue';

interface StateType {
    socket: Socket | null;
}

const state: StateType = reactive({
    socket: null
});

export const initializeGlobalSocket = (): void => {
    if (!state.socket) {
        state.socket = initializeSocket();
    }
}

export const disconnectGlobalSocket = (): void => {
    if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
        console.log("socket disconnected");
    }
}

export default state;

function initializeSocket(): Socket {
    const host: string = window.location.host;
    let serverURL = "";
    let ioOptions: Partial<ManagerOptions & SocketOptions> = {
        transports: ['websocket'],
        path: "/blubbio-backend/socket.io",
        query: {
            token: localStorage.getItem('authToken'),
        }
    };
    if (host === "localhost:8080") {
        serverURL = "http://localhost:3000/";
        ioOptions = {
            transports: ['websocket'],
            path: "",
            query: {
                token: localStorage.getItem('authToken'),
            }
        };
    }
    console.log("socket connected");
    const socket = io(serverURL, ioOptions);
    return socket;
}
