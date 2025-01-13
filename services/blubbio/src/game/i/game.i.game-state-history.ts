import { GAME_INPUT } from "../network/i/game.network.i.game-input";
import { Bubble } from "./game.i.bubble";

export interface GameStateHistory {
    inputHistory: InputFrame[],
    boardHistory: BoardHistoryFrame[],
    bubbleQueueHistory: BubbleQueueFrame[],
    angleHistory: AngleFrame[],
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

export interface CompressedGameStateHistory {
    i: CompressedInputFrame[], // inputHistory
    b: CompressedBoardHistoryFrame[], // boardHistory
    q: CompressedBubbleQueueFrame[], // bubbleQueueHistory
    a: CompressedAngleFrame[], // angleHistory
}

interface CompressedInputFrame {
    n: number,
    t: number,
    i: GAME_INPUT,
    a: number,
    g: number,
}
interface CompressedBoardHistoryFrame {
    t: number,
    b: string,
}
interface CompressedBubbleQueueFrame {
    t: number,
    c: Bubble,
    h?: Bubble,
    q: number,
    g: number,
}
interface CompressedAngleFrame {
    t: number,
    a: number,
}

export function compressReplayData(history: GameStateHistory): CompressedGameStateHistory {
    return {
        i: history.inputHistory.map(frame => ({ n: frame.indexID, t: frame.frameTime, i: frame.input, a: frame.angle, g: frame.garbageAmount })),
        b: history.boardHistory.map(frame => ({ t: frame.frameTime, b: frame.boardState })),
        q: history.bubbleQueueHistory.map(frame => ({ t: frame.frameTime, c: frame.currentBubble, h: frame.heldBubble, q: frame.queueSeedState, g: frame.garbageSeedState })),
        a: history.angleHistory.map(frame => ({ t: frame.frameTime, a: frame.angle })),
    };
}

export function decompressReplayData(compressed: CompressedGameStateHistory): GameStateHistory | null {
    try {
        const decompressed: GameStateHistory = {
            inputHistory: compressed.i.map(frame => ({ indexID: frame.n, frameTime: frame.t, input: frame.i, angle: frame.a, garbageAmount: frame.g })),
            boardHistory: compressed.b.map(frame => ({ frameTime: frame.t, boardState: frame.b })),
            bubbleQueueHistory: compressed.q.map(frame => ({ frameTime: frame.t, currentBubble: frame.c, heldBubble: frame.h, queueSeedState: frame.q, garbageSeedState: frame.g })),
            angleHistory: compressed.a.map(frame => ({ frameTime: frame.t, angle: frame.a })),
        };
        return decompressed;
    } catch (e) {
        console.error('Failed to decompress replay data');
    }
    return null;
}