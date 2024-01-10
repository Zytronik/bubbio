import io from 'socket.io-client';

const host = window.location.host;
let serverURL = "";
let ioOptions = {
    path: "/blubbio-backend/socket.io",
}
if (host === "localhost:8080") {
    serverURL = "http://localhost:3000/";
    ioOptions = {
        transports: ['websocket']
    };
}

export const socket = io(serverURL, ioOptions);