import { getVelocity } from "./gameplay.angle";
import { dissolveBubbles, getNearbyFields } from "./gameplay.grid-manager";
import { trackBubbleShot } from "./gameplay.stat-tracker";
import { Field } from "./i/gameplay.i.field";
import { GameInstance } from "./i/gameplay.i.game-instance";
import { Grid } from "./i/gameplay.i.grid";
import { Coordinates } from "./i/gameplay.i.grid-coordinates";

export function shootBubble(game: GameInstance, angle: number): void {
    const grid = game.playGrid;
    const bubble = game.currentBubble;
    const bubbleCoords = { x: grid.bubbleLauncherPosition.x, y: grid.bubbleLauncherPosition.y };
    let xDirection = getVelocity(angle, game.gameSettings).x;
    const yDirection = getVelocity(angle, game.gameSettings).y;
    let bounceAmount = 0
    while (!checkForCollision(grid, bubbleCoords)) {
        bubbleCoords.x += xDirection;
        bubbleCoords.y += yDirection;
        const hitLeftWall = bubbleCoords.x < grid.bubbleRadius;
        const hitRightWall = bubbleCoords.x > grid.precisionWidth - grid.bubbleRadius;
        if (hitLeftWall || hitRightWall) {
            xDirection = -xDirection;
            bounceAmount++;
        }
    }
    const gridField = snapToNextEmptyField(grid, bubbleCoords);
    gridField.bubble = bubble;
    const bubblesCleared = dissolveBubbles(grid, gridField);
    trackBubbleShot(game, bounceAmount, bubblesCleared);

    if (bubblesCleared < 3 && grid.rows[gridField.coords.y].isInDeathZone) {
        game.onGameDefeat();
    }
}

export function calculatePreview(game: GameInstance, angle: number): void {
    const grid = game.playGrid;
    const bubble = game.currentBubble;
    const bubbleCoords = { x: grid.bubbleLauncherPosition.x, y: grid.bubbleLauncherPosition.y };
    let xDirection = getVelocity(angle, game.gameSettings).x;
    const yDirection = getVelocity(angle, game.gameSettings).y;
    let bounceAmount = 0
    while (!checkForCollision(grid, bubbleCoords)) {
        bubbleCoords.x += xDirection;
        bubbleCoords.y += yDirection;
        const hitLeftWall = bubbleCoords.x < grid.bubbleRadius;
        const hitRightWall = bubbleCoords.x > grid.precisionWidth - grid.bubbleRadius;
        if (hitLeftWall || hitRightWall) {
            xDirection = -xDirection;
            bounceAmount++;
        }
    }
    if (!grid.previewBubble) {
        grid.previewBubble = {
            type: bubble.type,
            location: snapToNextEmptyField(grid, bubbleCoords).coords
        }
    } else {
        grid.previewBubble.type = bubble.type;
        grid.previewBubble.location = snapToNextEmptyField(grid, bubbleCoords).coords;
    }
}

function checkForCollision(grid: Grid, bubbleCenterCoords: Coordinates): boolean {
    let hasCollided = false;
    if (bubbleCenterCoords.y < grid.bubbleRadius) {
        return true;
    }
    getNearbyFields(grid, bubbleCenterCoords).forEach(field => {
        if (field.bubble) {
            const distance = getDistanceSquared(bubbleCenterCoords, field.centerPointCoords);
            if (distance < grid.collisionRangeSquared) {
                hasCollided = true;
            }
        }
    });
    return hasCollided;
}

function snapToNextEmptyField(grid: Grid, collisionCoords: Coordinates): Field {
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
    getNearbyFields(grid, collisionCoords).forEach(field => {
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