export interface GameTransitions {
    onGameStart: () => void,
    onGameLeave: () => void,
    onGameReset: () => void,
    onGameDefeat: () => void,
    onGameVictory: () => void,
}