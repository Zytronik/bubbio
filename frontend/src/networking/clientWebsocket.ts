import io, { ManagerOptions, SocketOptions } from 'socket.io-client';

const host: string = window.location.host;
let serverURL: string = "";
let ioOptions: Partial<ManagerOptions & SocketOptions> = {
    path: "/blubbio-backend/socket.io",
};
if (host === "localhost:8080") {
    serverURL = "http://localhost:3000/";
    ioOptions.transports = ['websocket'];
}

export const socket = io(serverURL, ioOptions);