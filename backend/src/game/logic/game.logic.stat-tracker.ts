import { GameInstance } from "../i/game.i.game-instance";

export function trackBubbleShot(game: GameInstance, wallBounces: number, amountCleared: number): void {
    const gameStats = game.stats;
    gameStats.bubblesShot++;
    gameStats.wallBounces += wallBounces;

    if (amountCleared > 0) {
        trackClearedBubbles(wallBounces, amountCleared);
    } else {
        breakCombo();
    }

    gameStats.bubblesLeftToClear = gameStats.bubbleClearToWin - gameStats.bubblesCleared;

    if (gameStats.bubblesCleared >= gameStats.bubbleClearToWin) {
        game.gameTransitions.onGameVictory();
    }

    function trackClearedBubbles(wallBounces: number, amountCleared: number) {
        gameStats.currentCombo++;
        gameStats.bubblesCleared += amountCleared;
        gameStats.highestBubbleClear = (gameStats.highestBubbleClear > amountCleared) ? gameStats.highestBubbleClear : amountCleared;
        
        if (wallBounces === 0 && amountCleared === 3) {
            gameStats.clear3++;
        } 
        if (wallBounces === 0 && amountCleared === 4) {
            gameStats.clear4++;
        } 
        if (wallBounces === 0 && amountCleared >= 5) {
            gameStats.clear5++;
        } 
        if (wallBounces > 0 && amountCleared === 3) {
            gameStats.clear3++;
        } 
        if (wallBounces > 0 && amountCleared === 4) {
            gameStats.clear4wb++;
        } 
        if (wallBounces > 0 && amountCleared >= 5) {
            gameStats.clear5wb++;
        } 
    }

    function breakCombo(): void {
        gameStats.highestCombo = (gameStats.highestCombo > gameStats.currentCombo) ? gameStats.highestCombo : gameStats.currentCombo;
        gameStats.currentCombo = 0;
    }
}
