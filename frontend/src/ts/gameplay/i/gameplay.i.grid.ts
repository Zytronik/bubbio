import { Row } from "./gameplay.i.row";

export interface Grid {
    width: number,
    height: number,
    extraHeight: number,
    rows: Row[]
}