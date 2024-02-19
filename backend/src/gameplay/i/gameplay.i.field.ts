import { Bubble } from "./gameplay.i.bubble";
import { Coordinates } from "./gameplay.i.grid-coordinates";
import { PreviewBubble } from "./gameplay.i.preview-bubble";

export interface Field {
    coords: Coordinates,
    centerPointCoords: Coordinates,
    bubble?: Bubble,
    previewBubble?: PreviewBubble,
}