import { Bubble } from "./gameplay.i.bubble";
import { GridCoordinates } from "./gameplay.i.grid-coordinates";

export interface Field {
    coords: GridCoordinates,
    bubble?: Bubble,
}