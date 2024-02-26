import { GameInstance } from "../i/game.i.game-instance";
import { GAME_MODE } from "../i/game.i.game-settings";
import { GameStats } from "../i/game.i.stats";

export function resetGameStats(gameStats: GameStats, gameMode: GAME_MODE): void {
    gameStats.gameStartTime = 0;
    gameStats.gameEndTime = 0;
    gameStats.bubbleClearToWin = gameMode === GAME_MODE.SPRINT ? 100 : Infinity;
    gameStats.bubblesCleared = 0;
    gameStats.bubblesLeftToClear = gameStats.bubbleClearToWin;
    gameStats.bubblesShot = 0;
    gameStats.bubblesPerSecond = 0;
    gameStats.bubbleClearStats = [];
    gameStats.highestBubbleClear = 0;
    gameStats.wallBounces = 0;
    gameStats.wallBounceClears = 0;
    gameStats.currentCombo = 0;
    gameStats.highestCombo = 0;
    gameStats.holds = 0;
}

export function startStatTracking(gameStats: GameStats, gameMode: GAME_MODE): void {
    gameStats.gameStartTime = performance.now();
    gameStats.bubbleClearToWin = gameMode === GAME_MODE.SPRINT ? 100 : Infinity;
    gameStats.bubblesLeftToClear = gameStats.bubbleClearToWin;
}

export function sumUpStats(gameStats: GameStats): void {
    gameStats.gameEndTime = performance.now();
    gameStats.gameDuration = gameStats.gameEndTime - gameStats.gameStartTime;
    gameStats.bubblesPerSecond = Number((gameStats.bubblesShot / gameStats.gameDuration * 1000).toFixed(2));
}

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

    if (game.gameMode === GAME_MODE.SPRINT && gameStats.bubblesCleared >= gameStats.bubbleClearToWin) {
        game.onGameVictory();
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
