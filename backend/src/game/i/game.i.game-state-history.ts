import { Bubble } from "./game.i.bubble";

export interface GameStateHistory {
    inputHistory: InputFrame[],
    boardHistory: BoardHistoryFrame[],
    bubbleQueueHistory: BubbleQueueFrame[],
    angleHistory: AngleFrame[],
    //sentgarbagehistory
    //receivedgarbagehistory
}

interface InputFrame {
    orderID: number,
    frameTime: number,
    input: GAME_INPUT,
    processed: boolean,
}

interface BoardHistoryFrame {
    orderID: number,
    frameTime: number,
    boardState: BoardString,
}

interface BubbleQueueFrame {
    orderID: number,
    frameTime: number,
    currentBubble: Bubble,
    heldBubble: Bubble,
    XORShift32State: number,
}

interface AngleFrame {
    orderID: number,
    frameTime: number,
    angle: number,
}

interface BoardString {
    value: string,
}

export enum GAME_INPUT {
    SHOOT = 'SHOOT',
    HOLD = 'HOLD',
}