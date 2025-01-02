import { defineStore } from "pinia";
import { getEmptyGame, newSprintInstance, } from "@/ts/game/setup";
import { GAME_MODE } from "@/ts/_enum/gameMode";
import { useUserStore } from "./userStore";
import { useInputStore } from "./inputStore";
import { INPUT_CONTEXT } from "@/ts/_enum/inputContext";
import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { startGameLoop } from "@/ts/game/gameLoop";
import { startAnimationLoop } from "@/ts/pixi/animation";

export const useGameStore = defineStore('game', () => {
    const userSession = useUserStore().getUserSession()
    const game = getEmptyGame();
    function setupSprint(): void {
        game.gameMode = GAME_MODE.SPRINT;
        game.inputContext = INPUT_CONTEXT.GAME_WITH_RESET;
        game.spectating = false;
        game.instancesMap.set(userSession.username, newSprintInstance());
    }
    function startGame(): void {
        useInputStore().setInputContext(game.inputContext);
        startAnimationLoop();
        startGameLoop();
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
            instance.right = true;
        }
    }
    function releasedRight(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.right = false;
        }
    }
    function toggleAPS(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            const currentAPS = instance.aps;
            const defaultAPS = instance.handlingSettings.defaultAPS;
            const toggleASP = instance.handlingSettings.toggleAPS;
            instance.aps = (currentAPS === defaultAPS) ? toggleASP : defaultAPS;
        }
    }
    function pressedCenter(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.angle = 90;
        }
    }
    function pressedMirror(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.angle = Math.abs(instance.angle - 180);
        }
    }
    function pressedShoot(userName: string): void {
        console.log("you are not empty eslint :^)")
    }
    function pressedHold(userName: string): void {
        console.log("you are not empty eslint :^)")
    }
    function getAllInstances(): IterableIterator<GameInstance> {
        return game.instancesMap.values();
    }

    return {
        setupSprint, startGame,
        pressedLeft, pressedRight,
        releasedLeft, releasedRight,
        toggleAPS,
        pressedCenter, pressedMirror, pressedShoot, pressedHold,
        getAllInstances
    }
})
