import { shootInput } from "../input/input.possible-inputs";
import { getVelocity } from "./gameplay.angle";
import { getCurrentBubble, prepareNextBubble } from "./gameplay.bubble-manager";
import { firePlayerDiedEvent } from "./gameplay.game-master";
import { dissolveBubbles, getBubbleLauncherPosition, getBubbleRadius, getCollisionRangeSquared, getNearbyFields, getPlayGridRows, getVisualHeight, getVisualWidth } from "./gameplay.playgrid";
import { XORShift32 } from "./gameplay.random";
import { trackBubbleShot } from "./gameplay.stat-tracker";
import { Field } from "./i/gameplay.i.field";
import { Coordinates } from "./i/gameplay.i.grid-coordinates";

export function setupShootControls(): void {
    shootInput.fire = shootBubble;
}

export function enableShootControls(): void {
    shootInput.enabled = true;
}

export function disableShootControls(): void {
    shootInput.enabled = false;
}

function shootBubble(): void {
    // const t1 = performance.now()
    const bubbleCoords = { x: getBubbleLauncherPosition().x, y: getBubbleLauncherPosition().y };
    let xDirection = getVelocity().x;
    const yDirection = getVelocity().y;
    let bounceAmount = 0
    while (!checkForCollision(bubbleCoords)) {
        bubbleCoords.x += xDirection;
        bubbleCoords.y += yDirection;
        const hitLeftWall = bubbleCoords.x < getBubbleRadius();
        const hitRightWall = bubbleCoords.x > getVisualWidth() - getBubbleRadius();
        if (hitLeftWall || hitRightWall) {
            xDirection = -xDirection;
            bounceAmount++;
        }
    }
    // console.log("bounceAmount", bounceAmount, "performance:", performance.now() - t1)
    const gridField = snapToNextEmptyField(bubbleCoords);
    if (getPlayGridRows()[gridField.coords.y].isInDeathZone) {
        firePlayerDiedEvent();
    }
    gridField.bubble = getCurrentBubble();
    const bubblesCleared = dissolveBubbles(gridField);
    trackBubbleShot(bounceAmount, bubblesCleared);
    prepareNextBubble();
}

export function calculatePreview(): Coordinates {
    const bubbleCoords = { x: getBubbleLauncherPosition().x, y: getBubbleLauncherPosition().y };
    let xDirection = getVelocity().x;
    const yDirection = getVelocity().y;
    let bounceAmount = 0
    while (!checkForCollision(bubbleCoords)) {
        bubbleCoords.x += xDirection;
        bubbleCoords.y += yDirection;
        const hitLeftWall = bubbleCoords.x < getBubbleRadius();
        const hitRightWall = bubbleCoords.x > getVisualWidth() - getBubbleRadius();
        if (hitLeftWall || hitRightWall) {
            xDirection = -xDirection;
            bounceAmount++;
        }
    }
    return snapToNextEmptyField(bubbleCoords).coords;
}

function checkForCollision(bubbleCenterCoords: Coordinates): boolean {
    let hasCollided = false;
    if (bubbleCenterCoords.y < getBubbleRadius()) {
        return true;
    }
    getNearbyFields(bubbleCenterCoords).forEach(field => {
        if (field.bubble) {
            const distance = getDistanceSquared(bubbleCenterCoords, field.centerPointCoords);
            if (distance < getCollisionRangeSquared()) {
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
    const randomX = random.randomInt(0, getVisualWidth())
    const randomY = random.randomInt(0, getVisualHeight())
    const coords: Coordinates = {
        x: randomX,
        y: randomY,
    }
    return coords;
}