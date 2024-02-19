import { Coordinates } from "./game.i.grid-coordinates";
import { Row } from "./game.i.row";

export interface Grid {
    visualWidth: number,
    rowHeight: number,
    visualHeight: number,
    gridWidth: number,
    gridHeight: number,
    extraGridHeight: number,
    rows: Row[],
    bubbleRadius: number,
    bubbleLauncherPosition: Coordinates,
    collisionRangeSquared: number,
}