import { Coordinates } from "./gameplay.i.grid-coordinates";
import { PreviewBubble } from "./gameplay.i.preview-bubble";
import { Row } from "./gameplay.i.row";

export interface Grid {
    precisionWidth: number,
    precisionHeight: number,
    precisionRowHeight: number,
    gridWidth: number,
    gridHeight: number,
    extraGridHeight: number,
    rows: Row[],
    bubbleRadius: number,
    bubbleLauncherPosition: Coordinates,
    previewBubble?: PreviewBubble,
    collisionRangeSquared: number,
    dissolveFloatingBubbles: boolean,
}