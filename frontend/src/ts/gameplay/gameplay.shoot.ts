import { shootInput } from "../input/input.possible-inputs";
import { getRandomBubble } from "./gameplay.bubble-manager";
import { getAllFields, playGrid } from "./gameplay.playgrid";
import { XORShift32 } from "./gameplay.random";
import { Bubble } from "./i/gameplay.i.bubble";
import { Field } from "./i/gameplay.i.field";
import { Coordinates } from "./i/gameplay.i.grid-coordinates";

export function setupShootControls() {
    shootInput.fire = shootBubble;
}

function shootBubble(): void {
    const nextBubble: Bubble = getRandomBubble();
    const randomCoords = getRandomCoords();
    const gridField = snapToGrid(randomCoords);
    gridField.bubble = nextBubble;
    console.log("randomCoords", randomCoords, "gridField", gridField);
}

function snapToGrid(collisionCoords: Coordinates): Field {
    let closestField: Field = {
        coords: {
            x: -1,
            y: -1,
        },
        centerPointCoords: {
            x: 0,
            y: 0,
        }
    }
    let closestDistance = Infinity;
    getAllFields().forEach(field => {
        if (!field.bubble) {
            const distance = getDistance(collisionCoords, field.centerPointCoords);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestField = field;
            }
        }
    });

    return closestField;
}

function getDistance(p1: Coordinates, p2: Coordinates): number {
    const deltaXSquared = (p1.x - p2.x) ** 2;
    const deltaYSquared = (p1.y - p2.y) ** 2;
    return Math.sqrt(deltaXSquared + deltaYSquared);
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