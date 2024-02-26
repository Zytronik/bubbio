export interface GameTransitions {
    onGameStart: () => void,
    onGameReset: () => void,
    onGameAbort: () => void,
    onGameDefeat: () => void,
    onGameVictory: () => void,
}