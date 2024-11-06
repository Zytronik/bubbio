import { defineStore } from "pinia";
import { setupEmptyGame } from "@/ts/game/setup";
import { GAME_MODE } from "@/ts/_enum/gameMode";
import { useUserStore } from "./userStore";

export const useGameStore = defineStore('game', () => {
    const game = setupEmptyGame();
    function setupSprint(): void {
        game.gameMode = GAME_MODE.SPRINT;
        game.spectating = false;
        const userDetails = useUserStore().getUserSession()
        if (userDetails) {
            // game.instancesMap.set(useUserStore().getUserSession(), null);
        }
    }
    function startGame(): void {

    }
    return { setupSprint, startGame}
})
