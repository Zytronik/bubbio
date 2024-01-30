import { shootInput } from "../input/input.possible-inputs";
import { getRandomBubble } from "./gameplay.bubble-manager";
import { playGrid } from "./gameplay.playgrid";
import { XORShift32 } from "./gameplay.random";
import { Bubble } from "./i/gameplay.i.bubble";
import { Coordinates } from "./i/gameplay.i.grid-coordinates";

export function setupShootControls() {
    shootInput.fire = shootBubble;
}

function shootBubble(): void {
    const nextBubble: Bubble = getRandomBubble();
    const randomCoords = getRandomCoords();
    const gridCoords = snapToGrid(randomCoords);
    console.log("randomCoords", randomCoords, "gridCoords", gridCoords);
}

function snapToGrid(visualCoordinates: Coordinates): Coordinates {
    const bubbleRadius = playGrid.bubbleRadius;
    const bubbleDiameter = playGrid.bubbleRadius * 2;
    const gridY = Math.round(visualCoordinates.y / playGrid.rowHeight);
    const isEvenRow = playGrid.rows[gridY];
    const gridX = Math.round((visualCoordinates.x - (isEvenRow ? bubbleRadius : bubbleDiameter))/bubbleDiameter);
    const gridCoordinates: Coordinates = {
        x: gridX,
        y: gridY,
    }
    return gridCoordinates;
}

function getRandomCoords(): Coordinates {
    const random = new XORShift32()
    // console.log("playGrid.visualWidth", playGrid.visualWidth, "playGrid.visualHeight", playGrid.visualHeight)
    const randomX = random.randomInt(0, playGrid.visualWidth)
    const randomY = random.randomInt(0, playGrid.visualHeight)
    const coords: Coordinates = {
        x: randomX,
        y: randomY,
    }
    return coords;
}