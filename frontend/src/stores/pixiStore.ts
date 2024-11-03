import { setupPixiContainers } from "@/ts/pixi/containers";
import { allTextures } from "@/ts/pixi/textureReference";
import { animationLoop } from "@/ts/pixi/animationLoop";
import { defineStore } from "pinia";
import { Application, Assets } from "pixi.js";

export const usePixiStore = defineStore('pixi', () => {
    const pixiApp = new Application();
    function initPixiApp() {
        const CANVAS_ID = "#pixiCanvas";
        pixiApp.init({
            background: '#1099bb',
            resizeTo: window,
        }).then(async () => {
            document.querySelector(CANVAS_ID)?.appendChild(pixiApp.canvas);
            setupPixiContainers();
            animationLoop();
        });
        allTextures.forEach(async asset => {
            asset.texture = await Assets.load(asset.src);
        });
    }
    function getPixiApp() {
        return pixiApp;
    }
    return { pixiApp, initPixiApp, getPixiApp }
})