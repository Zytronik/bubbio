import { Coordinates } from "./coordinates";
import { Row } from "./row";

export interface Grid {
    gridWidth: number,
    gridHeight: number,
    extraGridHeight: number,
    bubblePrecisionRadius: number,
    precisionWidth: number,
    precisionRowHeight: number,
    precisionHeight: number,
    rows: Row[],
    launcherPrecisionPosition: Coordinates,
    collisionRangeSquared: number,
}