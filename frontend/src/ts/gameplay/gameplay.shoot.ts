import { shootInput } from "../input/input.possible-inputs";
import { getVelocity } from "./gameplay.angle";
import { currentBubble, prepareNextBubble } from "./gameplay.bubble-manager";
import { getNearbyFields, playGrid } from "./gameplay.playgrid";
import { XORShift32 } from "./gameplay.random";
import { Field } from "./i/gameplay.i.field";
import { Coordinates } from "./i/gameplay.i.grid-coordinates";

export function setupShootControls() {
    shootInput.fire = shootBubble;
}

let areyouded = false;
function shootBubble(): void {
    if (!areyouded) {
        // const t1 = performance.now()
        const bubbleCoords = { x: playGrid.bubbleLauncherPosition.x, y: playGrid.bubbleLauncherPosition.y };
        let xDirection = getVelocity().x;
        const yDirection = getVelocity().y;
        let bounceAmount = 0
        while (!checkForCollision(bubbleCoords)) {
            bubbleCoords.x += xDirection;
            bubbleCoords.y += yDirection;
            const hitLeftWall = bubbleCoords.x < playGrid.bubbleRadius
            const hitRightWall = bubbleCoords.x > playGrid.visualWidth - playGrid.bubbleRadius
            if (hitLeftWall || hitRightWall) {
                xDirection = -xDirection;
                bounceAmount++;
            }
        }
        // console.log("bounceAmount", bounceAmount, "performance:", performance.now() - t1)
        const gridField = snapToNextEmptyField(bubbleCoords);
        if (playGrid.rows[gridField.coords.y].isInDeathZone) {
            console.log("you ded")
            areyouded = true;
        }
        gridField.bubble = currentBubble;
        prepareNextBubble();
    }
}

export function calculatePreview(): Coordinates {
    const bubbleCoords = { x: playGrid.bubbleLauncherPosition.x, y: playGrid.bubbleLauncherPosition.y };
    let xDirection = getVelocity().x;
    const yDirection = getVelocity().y;
    let bounceAmount = 0
    while (!checkForCollision(bubbleCoords)) {
        bubbleCoords.x += xDirection;
        bubbleCoords.y += yDirection;
        const hitLeftWall = bubbleCoords.x < playGrid.bubbleRadius;
        const hitRightWall = bubbleCoords.x > playGrid.visualWidth - playGrid.bubbleRadius;
        if (hitLeftWall || hitRightWall) {
            xDirection = -xDirection;
            bounceAmount++;
        }
    }
    return snapToNextEmptyField(bubbleCoords).coords;
}

function checkForCollision(bubbleCenterCoords: Coordinates): boolean {
    let hasCollided = false;
    if (bubbleCenterCoords.y < playGrid.bubbleRadius) {
        return true;
    }
    getNearbyFields(bubbleCenterCoords).forEach(field => {
        if (field.bubble) {
            const distance = getDistanceSquared(bubbleCenterCoords, field.centerPointCoords);
            if (distance < playGrid.collisionRangeSquared) {
                hasCollided = true;
            }
        }
    });
    return hasCollided;
}

function snapToNextEmptyField(collisionCoords: Coordinates): Field {
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
    getNearbyFields(collisionCoords).forEach(field => {
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
    return Math.floor(Math.sqrt(deltaXSquared + deltaYSquared));
}

function getDistanceSquared(p1: Coordinates, p2: Coordinates): number {
    const deltaXSquared = (p1.x - p2.x) ** 2;
    const deltaYSquared = (p1.y - p2.y) ** 2;
    return deltaXSquared + deltaYSquared;
}

function getRandomCoords(): Coordinates {
    const random = new XORShift32()
    const randomX = random.randomInt(0, playGrid.visualWidth)
    const randomY = random.randomInt(0, playGrid.visualHeight)
    const coords: Coordinates = {
        x: randomX,
        y: randomY,
    }
    return coords;
}