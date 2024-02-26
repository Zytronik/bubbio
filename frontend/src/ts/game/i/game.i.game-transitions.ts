export interface GameTransitions {
    onGameStart: () => void,
    onGameAbort: () => void,
    onGameVictory: () => void,
    onGameReset: () => void,
    onGameDefeat: () => void,
}