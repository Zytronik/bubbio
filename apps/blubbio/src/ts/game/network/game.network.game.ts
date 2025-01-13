import state from "../../networking/networking.client-websocket";
import eventBus from "@/ts/page/page.event-bus";
import { GameInstance } from "../i/game.i.game-instance";
import { dto_GameSetup } from "./dto/game.network.dto.game-setup";
import { GAME_STATE } from "../i/game.e.state";
import { dto_Inputs } from "./dto/game.network.dto.input";
import { dto_CountDown } from "./dto/game.network.dto.count-down";
import { GAME_MODE } from "../settings/i/game.settings.e.game-modes";
import { dto_AngleUpdate } from "./dto/game.network.dto.angle-update";
import { InputFrame } from "../i/game.i.game-state-history";
import { NetworkEvaluation } from "./i/game.network.i.evaluation-data";
import { ref } from "vue";
import { playerGameInstance } from "../game.master";

const I_ANGLE_INPUTS = "input_angleInputs";
const I_QUEUE_INPUTS = "input_queueUpGameInputs";
const O_QUEUE_INPUTS = "output_highestInputIndexReceived";
const I_COUNT_DOWN_STATE = "I_COUNT_DOWN_STATE";
const O_DISCONNECTED = "output_disconnected";

const I_SINGLEPLAYER_SETUP_GAME = "I_SINGLEPLAYER_SETUP_GAME";
const I_SINGLEPLAYER_RESET_GAME = "I_SINGLEPLAYER_RESET_GAME";
const I_SINGLEPLAYER_LEAVE_GAME = "I_SINGLEPLAYER_LEAVE_GAME";
const I_SINGLEPLAYER_NETWORK_EVAL = "I_SINGLEPLAYER_NETWORK_EVAL";
const O_SINGLEPLAYER_NETWORK_EVAL = "O_SINGLEPLAYER_NETWORK_EVAL";

const DO_LOG_ERROR = "debugOutput_logError";

const registeredGameEvents: Set<string> = new Set();
export function network_setupGame(playerGameInstance: GameInstance): void {
    if (state.socket) {
        const networkData: dto_GameSetup = {
            gameMode: playerGameInstance.gameMode,
            gameSettings: playerGameInstance.gameSettings,
            seed: playerGameInstance.initialSeed,
            matchID: "none",
        }
        state.socket.emit(I_SINGLEPLAYER_SETUP_GAME, networkData);
        network_listenToQueuedInputsIndex(playerGameInstance);
        registeredGameEvents.add(O_QUEUE_INPUTS);
    } else {
        console.error("network_setupGame()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_listenToQueuedInputsIndex(playerGameInstance: GameInstance): void {
    if (state.socket && !registeredGameEvents.has(O_QUEUE_INPUTS)) {
        state.socket.on(O_QUEUE_INPUTS, (data: number) => {
            playerGameInstance.processedInputsIndex = data;
        });
        state.socket.on(DO_LOG_ERROR, (data) => {
            console.error("backend error: ", data);
        });
        state.socket.on(O_DISCONNECTED, () => {
            eventBus.emit("show-info-message", { message: "You have been disconnected from the server.", type: "error" });
        });
        registeredGameEvents.add(O_QUEUE_INPUTS);
    } else {
        console.error("network_listenToQueuedInputsIndex()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_stopListenToQueuedInputsIndex(): void {
    if (state.socket) {
        state.socket.off(O_QUEUE_INPUTS);
        state.socket.off(DO_LOG_ERROR);
        state.socket.off(O_DISCONNECTED);
        registeredGameEvents.delete(O_QUEUE_INPUTS);
    } else {
        console.error("network_stopListenToQueuedInputsIndex()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}


export function network_countDownState(matchID: string, gameMode: GAME_MODE, gameState: GAME_STATE): void {
    const countDownData: dto_CountDown = {
        matchID: matchID,
        gameMode: gameMode,
        countDown: gameState,
    };
    if (state.socket) {
        state.socket.emit(I_COUNT_DOWN_STATE, countDownData);
    } else {
        console.error("network_countDownState()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_sendInputs(gameInstance: GameInstance): void {
    const inputdata: dto_Inputs = {
        gameMode: gameInstance.gameMode,
        matchID: gameInstance.matchID,
        inputs: [],
    };
    if (state.socket) {
        const history = gameInstance.gameStateHistory.inputHistory;
        for (let i = 0; i < history.length; i++) {
            history[i].indexID = i;
        }
        inputdata.inputs = gameInstance.gameStateHistory.inputHistory.slice(gameInstance.processedInputsIndex);
        state.socket.emit(I_QUEUE_INPUTS, inputdata);
    } else {
        console.error("network_sendInputs()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_updateAngle(gameInstance: GameInstance): void {
    if (state.socket) {
        const angleData: dto_AngleUpdate = {
            gameMode: gameInstance.gameMode,
            matchID: gameInstance.matchID,
            angle: gameInstance.angle,
            frameTime: performance.now() - gameInstance.stats.gameStartTime,
        }
        state.socket.emit(I_ANGLE_INPUTS, angleData);
    } else {
        console.error("network_updateAngle()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_resetGame(seed: number): void {
    if (state.socket) {
        state.socket.emit(I_SINGLEPLAYER_RESET_GAME, seed);
    } else {
        console.error("network_resetGame()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_leaveGame(): void {
    if (state.socket) {
        state.socket.emit(I_SINGLEPLAYER_LEAVE_GAME);
        network_stopListenToQueuedInputsIndex();
    } else {
        console.error("network_leaveGame()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export const evaluationData: NetworkEvaluation = {
    totalMatches: ref(0),
    totalMismatches: ref(0),
    inputErrors: ref(""),
    boardErrors: ref(""),
    queueErrors: ref(""),
    angleErrors: ref(""),
}
export function network_getNetworkEval(): void {
    if (state.socket) {
        state.socket.emit(I_SINGLEPLAYER_NETWORK_EVAL);
        if (!registeredGameEvents.has(O_SINGLEPLAYER_NETWORK_EVAL)) {
            state.socket.on(O_SINGLEPLAYER_NETWORK_EVAL, (data) => {
                evaluationData.totalMatches.value = 0;
                evaluationData.totalMismatches.value = 0;
                evaluationData.inputErrors.value = "";
                evaluationData.boardErrors.value = "";
                evaluationData.queueErrors.value = "";
                evaluationData.angleErrors.value = "";
                const history = playerGameInstance.gameStateHistory;
                history.inputHistory.forEach((inputFrame, index) => {
                    if (data.inputHistory[index]) {
                        compareInputFrames(inputFrame, data.inputHistory[index])
                    } else {
                        evaluationData.totalMismatches.value++;
                        evaluationData.inputErrors.value += `InputHistory ${index}: missing\n`;
                    }
                });
            });
            registeredGameEvents.add(O_QUEUE_INPUTS);
        }
    } else {
        console.error("network_getNetworkEval()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }

    function compareInputFrames(frameA: InputFrame, frameB: InputFrame): boolean {
        let inputsMatch = true;
        if (frameA.input !== frameB.input) {
            evaluationData.inputErrors.value += `InputHistory ${frameA.indexID}: input mismatch: ${frameA.input}/${frameB.input}\n`;
            inputsMatch = false;
        }
        if (frameA.angle !== frameB.angle) {
            evaluationData.inputErrors.value += `InputHistory ${frameA.indexID}: angle mismatch: ${frameA.angle}/${frameB.angle}\n`;
            inputsMatch = false;
        }
        if (frameA.garbageAmount !== frameB.garbageAmount) {
            evaluationData.inputErrors.value += `InputHistory ${frameA.indexID}: garbageAmount mismatch: ${frameA.garbageAmount}/${frameB.garbageAmount}\n`;
            inputsMatch = false;
        }
        evaluationData.totalMismatches.value += inputsMatch ? 0 : 1;
        evaluationData.totalMatches.value += inputsMatch ? 1 : 0;
        return inputsMatch;
    }
}