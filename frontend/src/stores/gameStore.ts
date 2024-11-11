import { defineStore } from "pinia";
import { getEmptyGame,  } from "@/ts/game/setup";
import { GAME_MODE } from "@/ts/_enum/gameMode";
import { useUserStore } from "./userStore";

export const useGameStore = defineStore('game', () => {
    const game = getEmptyGame();
    function setupSprint(): void {
        game.gameMode = GAME_MODE.SPRINT;
        game.spectating = false;
        // game.instancesMap.set(useUserStore().getUserSession(), getNewSprintInstance());
    }
    function startGame(): void {

    }
    return { setupSprint, startGame }
})
