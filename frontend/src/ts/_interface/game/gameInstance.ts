import { Container } from "pixi.js";
import { Bubble } from "./bubble";
import { GameStats } from "./gameStats";
import { GarbageQueue } from "./garbageQueue";
import { Grid } from "./grid";
import { PixiAnimation } from "../pixiAnimation";
import { GameSettings } from "./gameSettings";
import { HandlingSettings } from "./handlingSettings";
import { GameSprites } from "./gameSprites";
import { GameContainers } from "./gameContainers";

export interface GameInstance {
    gameSettings: GameSettings,
    handlingSettings: HandlingSettings,
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
    aps: number,

    gameSprites: GameSprites,
    gameContainers: GameContainers,
    instanceAnimations: PixiAnimation[],
}