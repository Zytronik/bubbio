import { angleUpdate } from "./angle";

let gameLoopRunning = false;
export function startGameLoop(): void {
    if (!gameLoopRunning) {
        gameLoop();
        gameLoopRunning = true;
    }
}

let lastTick = 0;
function gameLoop(): void {
    const now = performance.now()
    if (lastTick === 0) {
        lastTick = now;
    } 
    const deltaTimeMS = now - lastTick;

    angleUpdate(deltaTimeMS);

    requestAnimationFrame(() => gameLoop());
    lastTick = performance.now()
}
