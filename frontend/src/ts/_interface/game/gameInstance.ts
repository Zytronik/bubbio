import { Container } from "pixi.js";
import { Bubble } from "./bubble";
import { GameStats } from "./gameStats";
import { GarbageQueue } from "./garbageQueue";
import { Grid } from "./grid";
import { PixiAnimation } from "../pixiAnimation";

export interface GameInstance {
    bubbleSeed: number,
    garbageSeed: number,
    angle: number,
    currentBubble: Bubble,
    previewBubble?: Bubble,
    holdBubble?: Bubble,
    bubbleQueue: Bubble[],
    playGrid: Grid,
    queuedGarbage: GarbageQueue,
    stats: GameStats,
    //replaydata

    left: boolean,
    right: boolean,
    animationContainer: Container,
    instanceAnimations: PixiAnimation[],
}