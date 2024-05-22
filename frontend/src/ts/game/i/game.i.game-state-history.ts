import { GAME_INPUT } from "../network/i/game.network.i.game-input";
import { Bubble } from "./game.i.bubble";

export interface GameStateHistory {
    inputHistory: InputFrame[],
    boardHistory: BoardHistoryFrame[],
    bubbleQueueHistory: BubbleQueueFrame[],
    angleHistory: AngleFrame[],
    sentgarbagehistory: GarbageFrame[],
    receivedgarbagehistory: GarbageFrame[],
}

export interface InputFrame {
    indexID: number,
    frameTime: number,
    input: GAME_INPUT,
    angle: number,
    garbageAmount: number,
}

export interface BoardHistoryFrame {
    frameTime: number,
    boardState: string,
}

export interface BubbleQueueFrame {
    frameTime: number,
    currentBubble: Bubble,
    heldBubble?: Bubble,
    queueSeedState: number,
    garbageSeedState: number,
}

export interface AngleFrame {
    frameTime: number,
    angle: number,
}

export interface GarbageFrame {
    frameTime: number,
    garbageAmount: number,
    seedState: number,
}