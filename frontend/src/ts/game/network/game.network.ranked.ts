import eventBus from "@/ts/page/page.event-bus";
import state from "../../networking/networking.client-websocket";
import { dto_VersusScreen } from "./dto/game.network.dto.vs-screen";
import { dto_GameSetup } from "./dto/game.network.dto.game-setup";
import { preparePlayerGameInstance, startGame } from "../game.master";
import { createGameInstance } from "../logic/game.logic.instance-creator";
import { GameTransitions } from "../i/game.i.game-transitions";
import { getHandlingSettings } from "../settings/game.settings.handling";

const O_RANKED_MATCH_FOUND = "output_rankedMatchFound";
const O_RANKED_SETUP_GAME_INSTANCE = "output_rankedSetupGameInstance";
const I_RANKED_MATCH_FOUND_CONFIRMATION = "input_rankedMatchFoundConfirmation";
const I_RANKED_SETUP_GAME_CONFIRMATION = "input_rankedSetupGameConfirmation";
const O_RANKED_GO_TO_GAME_VIEW = "output_rankedGoToGameView";
const O_RANKED_START_GAME = "output_rankedStartGame";
const O_RANKED_SHOW_MATCH_SCORE = "output_rankedShowMatchScore";

export const versusScreenData: dto_VersusScreen = {
    matchID: ""
};
export function network_listenToMatchFound(): void {
    console.log("setuplistener")
    const socket = state.socket;
    if (socket) {
        socket.on(O_RANKED_MATCH_FOUND, (data: dto_VersusScreen) => {
            // versusScreenData = data;
            console.log("MATCH FOUND!");
            eventBus.emit("vue_matchFound");
            socket.emit(I_RANKED_MATCH_FOUND_CONFIRMATION, data.matchID);
        });
        socket.on(O_RANKED_SETUP_GAME_INSTANCE, (data: dto_GameSetup) => {
            const transitions: GameTransitions = {
                /* eslint-disable @typescript-eslint/no-empty-function */
                onGameStart: function (): void {
                    console.log("start");
                },
                onGameLeave: () => { },
                onGameReset: () => { },
                onGameDefeat: function (): void {
                    console.log("death");
                },
                onGameVictory: function (): void {
                    console.log("win");
                },
                /* eslint-enable @typescript-eslint/no-empty-function */
            };
            const instance = createGameInstance(
                data.gameMode, 
                data.gameSettings, 
                getHandlingSettings(), 
                transitions, 
                data.seed,
                data.matchID);
            preparePlayerGameInstance(instance);
            //dont forget network_setupGame
            socket.emit(I_RANKED_SETUP_GAME_CONFIRMATION, data.matchID);
        });
        socket.on(O_RANKED_GO_TO_GAME_VIEW, () => {
            console.log("go to game view")
        });
        socket.on(O_RANKED_START_GAME, () => {
            startGame();
        });
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}

export function network_stopListeningToMatchFound(): void {
    const socket = state.socket;
    if (socket) {
        socket.off(O_RANKED_MATCH_FOUND);
        socket.off(O_RANKED_SETUP_GAME_INSTANCE);
        socket.off(O_RANKED_GO_TO_GAME_VIEW);
        socket.off(O_RANKED_START_GAME);
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}