import { Bubble } from "./game.i.bubble";
import { Coordinates } from "./game.i.grid-coordinates";
import { PreviewBubble } from "./game.i.preview-bubble";

export interface Field {
    coords: Coordinates,
    centerPointCoords: Coordinates,
    bubble?: Bubble,
    previewBubble?: PreviewBubble,
}