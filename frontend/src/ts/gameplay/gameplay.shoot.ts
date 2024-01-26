import { shootInput } from "../input/input.possible-inputs";
import { getRandomBubble } from "./gameplay.bubble-manager";
import { playGrid } from "./gameplay.playgrid";
import { XORShift32 } from "./gameplay.random";
import { Bubble } from "./i/gameplay.i.bubble";
import { GridCoordinates } from "./i/gameplay.i.grid-coordinates";

export function setupShootControls() {
    shootInput.fire = shootBubble;
}

function shootBubble(): void {
    const nextBubble: Bubble = getRandomBubble();
    const randomCoords = getRandomCoords();

    nextBubble
}

function snapToGrid(bubble: Bubble): void {
    console.log("snap");
}

function getRandomCoords(): GridCoordinates {
    const random = new XORShift32()
    console.log("playGrid.visualWidth", playGrid.visualWidth, "playGrid.visualHeight", playGrid.visualHeight)
    console.log(playGrid)
    const randomX = random.randomInt(0, playGrid.visualWidth)
    const randomY = random.randomInt(0, playGrid.visualHeight)
    const coords: GridCoordinates = {
        x: randomX,
        y: randomY,
    }
    return coords;
}