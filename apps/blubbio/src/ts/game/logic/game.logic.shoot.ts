import { getVelocity } from "./game.logic.angle";
import { checkPerfectClear, dissolveBubbles, getNearbyFields } from "./game.logic.grid-manager";
import { trackBubbleShot } from "./game.logic.stat-tracker";
import { Field } from "../i/game.i.field";
import { GameInstance } from "../i/game.i.game-instance";
import { Grid } from "../i/game.i.grid";
import { Coordinates } from "../i/game.i.grid-coordinates";
import { getGarbageAmount, receiveGarbageAndCheckDead } from "./game.logic.garbage";
import { updateBubbleQueueAndCurrent } from "./game.logic.bubble-manager";

export function executeShot(playerGameInstance: GameInstance): void {
    const shootResult = shootBubble(playerGameInstance);
    if (!shootResult.hasdied && shootResult.clearAmount === 0) {
        const hasDied = receiveGarbageAndCheckDead(playerGameInstance);
        if (hasDied) {
            return;
        }
    }
    if (playerGameInstance.gameSettings.refillBoard && playerGameInstance.queuedGarbage === 0) {
        const refillBoardAtLine = playerGameInstance.gameSettings.refillBoardAtLine;
        const line = playerGameInstance.playGrid.rows[refillBoardAtLine]
        let hasToRefill = false;
        for (const field of line.fields) {
            if (field.bubble === undefined) {
                hasToRefill = true
            }
        }
        if (hasToRefill) {
            playerGameInstance.queuedGarbage += playerGameInstance.gameSettings.refillAmount;
        }
    }
    updateBubbleQueueAndCurrent(playerGameInstance);
}

export function shootBubble(game: GameInstance): {hasdied: boolean, clearAmount: number} {
    const angle = game.angle;
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
    const bubblesCleared = dissolveBubbles(grid, gridField, bubble.type, bounceAmount > 0);
    const hasPerfectCleared = checkPerfectClear(grid);
    const attack = getGarbageAmount(bubblesCleared, game.stats.currentCombo, hasPerfectCleared);
    let defense = 0;
    game.stats.attack += attack;
    if (attack > 0) {
        game.queuedGarbage -= attack;
        if (game.queuedGarbage < 0) {
            const garbageToSend = Math.abs(game.queuedGarbage);
            game.sendGarbage(garbageToSend);
            defense = attack - garbageToSend;
            game.queuedGarbage = 0;
        }
    }
    trackBubbleShot(game, bounceAmount, bubblesCleared, attack, defense, hasPerfectCleared);

    if (bubblesCleared < 3 && grid.rows[gridField.coords.y].isInDeathZone) {
        game.gameTransitions.onGameDefeat();
        return {hasdied: true, clearAmount: bubblesCleared};
    }
    return {hasdied: false, clearAmount: bubblesCleared};
}

export function calculatePreview(game: GameInstance): void {
    const angle = game.angle;
    const grid = game.playGrid;
    const bubble = game.currentBubble;
    const bubbleCoords = { x: grid.bubbleLauncherPosition.x, y: grid.bubbleLauncherPosition.y };
    let xDirection = getVelocity(angle, game.gameSettings).x;
    const yDirection = getVelocity(angle, game.gameSettings).y;
    const line: Coordinates[] = [{ x: grid.bubbleLauncherPosition.x, y: grid.bubbleLauncherPosition.y }];
    while (!checkForCollision(grid, bubbleCoords)) {
        bubbleCoords.x += xDirection;
        bubbleCoords.y += yDirection;
        const hitLeftWall = bubbleCoords.x < grid.bubbleRadius;
        const hitRightWall = bubbleCoords.x > grid.precisionWidth - grid.bubbleRadius;
        if (hitLeftWall || hitRightWall) {
            line.push({x: bubbleCoords.x, y: bubbleCoords.y})
            xDirection = -xDirection;
        }
    }
    line.push({x: bubbleCoords.x, y: bubbleCoords.y})
    if (!grid.previewBubble) {
        grid.previewBubble = {
            type: bubble.type,
            location: snapToNextEmptyField(grid, bubbleCoords).coords,
            travelLine: line,
        }
    } else {
        grid.previewBubble.type = bubble.type;
        grid.previewBubble.location = snapToNextEmptyField(grid, bubbleCoords).coords;
        grid.previewBubble.travelLine = line; 
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