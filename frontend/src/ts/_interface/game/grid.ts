import { Coordinates } from "./coordinates";
import { Row } from "./row";

export interface Grid {
    gridWidth: number,
    gridHeight: number,
    extraGridHeight: number,
    bubbleRadius: number,
    precisionWidth: number,
    precisionRowHeight: number,
    precisionHeight: number,
    rows: Row[],
    bubbleLauncherPosition: Coordinates,
    collisionRangeSquared: number,
}