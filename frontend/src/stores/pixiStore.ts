import { defineStore } from "pinia";
import { Application } from "pixi.js";

export const usePixiStore = defineStore('pixi', () => {
    const pixiApp = new Application();
    function initPixiApp() {
        const CANVAS_ID = "#pixiCanvas";
        pixiApp.init({
            background: '#1099bb',
            resizeTo: window,
        }).then(async () => {
          document.querySelector(CANVAS_ID)?.appendChild(pixiApp.canvas);
        });
    }
    function getPixiApp() {
        return pixiApp;
    }
    return { pixiApp, initPixiApp, getPixiApp }
})