import { Row } from "./gameplay.i.row";

export interface Grid {
    visualWidth: number,
    visualHeight: number,
    gridWidth: number,
    gridHeight: number,
    extraGridHeight: number,
    rows: Row[],
    bubbleRadius: number,
}