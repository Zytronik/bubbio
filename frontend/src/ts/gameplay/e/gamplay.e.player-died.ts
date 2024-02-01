export interface PlayerDiedEvent {
    fire: () => void;
}

/*
possible death events:
    - sprint
        restart / save replay
    - 1v1
        round / game over logic
    - training
        reset board
    - BR lobby
        spectate / go to training

    1v1 and BR might be the same logic. check if the game is still active 
*/