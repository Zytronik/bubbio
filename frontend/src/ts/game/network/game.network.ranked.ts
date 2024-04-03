import eventBus from "@/ts/page/page.event-bus";
import state from "../../networking/networking.client-websocket";

const O_RANKED_MATCH_FOUND = "output_rankedMatchFound";
const I_RANKED_MATCH_FOUND_CONFIRMATION = "input_rankedMatchFoundConfirmation";
const O_SETUP_RANKED_GAME = "output_setupRankedGame";
const I_SETUP_RANKED_GAME_CONFIRMATION = "input_setupRankedGameConfirmation";
const O_START_RANKED_GAME = "output_startRankedGame";

export function network_listenToMatchFound(): void {
    console.log("setuplistener")
    const socket = state.socket;
    if (socket) {
        socket.on(O_RANKED_MATCH_FOUND, () => {
            console.log("MATCH FOUND!");
            eventBus.emit("vue_matchFound");
            socket.emit(I_RANKED_MATCH_FOUND_CONFIRMATION);
        });
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}

export function network_stopListeningToMatchFound(): void {
    const socket = state.socket;
    if (socket) {
        socket.off(O_RANKED_MATCH_FOUND);
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}