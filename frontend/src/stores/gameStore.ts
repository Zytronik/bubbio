import { defineStore } from "pinia";
import { getEmptyGame, newSprintInstance,  } from "@/ts/game/setup";
import { GAME_MODE } from "@/ts/_enum/gameMode";
import { useUserStore } from "./userStore";
import { useInputStore } from "./inputStore";
import { INPUT_CONTEXT } from "@/ts/_enum/inputContext";

export const useGameStore = defineStore('game', () => {
    const userSession = useUserStore().getUserSession()
    const game = getEmptyGame();
    function setupSprint(): void {
        game.gameMode = GAME_MODE.SPRINT;
        game.spectating = false;
        game.instancesMap.set(userSession.username, newSprintInstance());
    }
    function startGame(): void {
        useInputStore().setInputContext(INPUT_CONTEXT.GAME_WITH_RESET);
        console.log("you are not empty eslint :^)")
    }
    function pressedLeft(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.left = true;
        }
    }
    function releasedLeft(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.left = false;
        }
    }
    function pressedRight(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.left = true;
        }
    }
    function releasedRight(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.left = false;
        }
    }
    function toggleAPS(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            // instance.
        }
    }
    function pressedShoot(userName: string): void {
        console.log("you are not empty eslint :^)")
    }
    function pressedHold(userName: string): void {
        console.log("you are not empty eslint :^)")
    }
    return { setupSprint, startGame, pressedLeft, pressedRight, releasedLeft, releasedRight, toggleAPS, pressedShoot, pressedHold }
})
