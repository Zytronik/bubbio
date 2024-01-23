import { Bubble } from "./gameplay.i.bubble";
import { Coords } from "./gameplay.i.coordinate";

export interface Field {
    coords: Coords,
    bubble?: Bubble,
}