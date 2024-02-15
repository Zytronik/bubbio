import { Bubble } from "./gameplay.i.bubble";
import { Coordinates } from "./gameplay.i.grid-coordinates";

export interface Field {
    coords: Coordinates,
    centerPointCoords: Coordinates,
    bubble?: Bubble,
}