import { GameInstance } from "@/ts/_interface/game/gameInstance";

export function shootBubble(instance: GameInstance): void {
    

    // const angle = instance.angle;
    // const grid = instance.playGrid;
    // const bubble = instance.currentBubble;
    // const bubbleCoords = { x: grid.bubbleLauncherPosition.x, y: grid.bubbleLauncherPosition.y };
    // let xDirection = getVelocity(angle, game.gameSettings).x;
    // const yDirection = getVelocity(angle, game.gameSettings).y;
    // let bounceAmount = 0
    // while (!checkForCollision(grid, bubbleCoords)) {
    //     bubbleCoords.x += xDirection;
    //     bubbleCoords.y += yDirection;
    //     const hitLeftWall = bubbleCoords.x < grid.bubbleRadius;
    //     const hitRightWall = bubbleCoords.x > grid.precisionWidth - grid.bubbleRadius;
    //     if (hitLeftWall || hitRightWall) {
    //         xDirection = -xDirection;
    //         bounceAmount++;
    //     }
    // }
    // const gridField = snapToNextEmptyField(grid, bubbleCoords);
    // gridField.bubble = bubble;
    // const bubblesCleared = dissolveBubbles(grid, gridField, bubble.type, bounceAmount > 0);
    // const hasPerfectCleared = checkPerfectClear(grid);
    // const attack = getGarbageAmount(bubblesCleared, game.stats.currentCombo, hasPerfectCleared);
    // let defense = 0;
    // game.stats.attack += attack;
    // if (attack > 0) {
    //     game.queuedGarbage -= attack;
    //     if (game.queuedGarbage < 0) {
    //         const garbageToSend = Math.abs(game.queuedGarbage);
    //         game.sendGarbage(garbageToSend);
    //         defense = attack - garbageToSend;
    //         game.queuedGarbage = 0;
    //     }
    // }
    // trackBubbleShot(game, bounceAmount, bubblesCleared, attack, defense, hasPerfectCleared);

    // if (bubblesCleared < 3 && grid.rows[gridField.coords.y].isInDeathZone) {
    //     game.gameTransitions.onGameDefeat();
    //     return {hasdied: true, clearAmount: bubblesCleared};
    // }
}