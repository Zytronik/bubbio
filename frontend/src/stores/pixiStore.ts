import { defineStore } from "pinia";
import { Application, Renderer } from "pixi.js";
import { ref } from "vue";

export const usePixiStore = defineStore('pixi', () => {
    const pixiApp = ref<Application<Renderer> | null>(null);
    function initPixiApp() {
        if (!pixiApp.value) {
            pixiApp.value = new Application();
            pixiApp.value.init({
                resizeTo: window,
            })
        }
    }
    function getPixiApp() {
        if (!pixiApp.value) {
            throw new Error('PIXI Application has not been initialized.');
        }
        return pixiApp.value;
    }
    return { pixiApp, initPixiApp, getPixiApp }
})