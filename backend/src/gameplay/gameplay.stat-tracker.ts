import { GAME_MODE, GameStats } from "./i/gameplay.i.stats";

export function trackBubbleShot(gameStats: GameStats, wallBounces: number, amountCleared: number): void {
    gameStats.bubblesShot++;
    gameStats.wallBounces += wallBounces;

    if (amountCleared > 0) {
        trackClearedBubbles(wallBounces, amountCleared);
    } else {
        breakCombo();
    }

    if (getSelectedGameMode() === GAME_MODE.SPRINT && gameStats.bubblesCleared >= gameStats.bubbleClearToWin) {
        fireGameWinEvent();
    }

    function trackClearedBubbles(wallBounces: number, amountCleared: number) {
        gameStats.currentCombo++;
        gameStats.bubblesCleared += amountCleared;
        gameStats.highestBubbleClear = (gameStats.highestBubbleClear > amountCleared) ? gameStats.highestBubbleClear : amountCleared;
        
        let clearStatIndex = amountCleared;
        if (wallBounces > 0) {
            gameStats.wallBounceClears++;
            clearStatIndex = -1 * clearStatIndex;
        } 
        
        if (!gameStats.bubbleClearStats[clearStatIndex]) {
            gameStats.bubbleClearStats[clearStatIndex] = 1;
        } else {
            gameStats.bubbleClearStats[clearStatIndex]++;
        }
    }

    function breakCombo(): void {
        gameStats.highestCombo = (gameStats.highestCombo > gameStats.currentCombo) ? gameStats.highestCombo : gameStats.currentCombo;
        gameStats.currentCombo = 0;
    }
}
