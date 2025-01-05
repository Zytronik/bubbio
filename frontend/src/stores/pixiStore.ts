import { setupPixiContainers } from "@/ts/pixi/containers";
import { allTextures } from "@/ts/pixi/allTextures";
import { startAnimationLoop } from "@/ts/pixi/animation";
import { defineStore } from "pinia";
import { Application, Assets } from "pixi.js";
import { allFonts } from "@/ts/pixi/allFonts";

export const usePixiStore = defineStore('pixi', () => {
    const pixiApp = new Application();
    function initPixiApp() {
        const CANVAS_ID = "#pixiCanvas";
        pixiApp.init({
            background: '#252525',
            resizeTo: window,
        }).then(async () => {
            document.querySelector(CANVAS_ID)?.appendChild(pixiApp.canvas);
            setupPixiContainers();
            startAnimationLoop();
        });
        allTextures.forEach(async asset => {
            asset.texture = await Assets.load(asset.src);
        });
        allFonts.forEach(async font => {
            await Assets.load(font.src);
        });
    }
    function getPixiApp() {
        return pixiApp;
    }
    function getCanvasHeight(): number {
        return pixiApp.canvas.height;
    }
    function getCanvasWidth(): number {
        return pixiApp.canvas.width;
    }
    return { pixiApp, initPixiApp, getPixiApp, getCanvasHeight, getCanvasWidth }
})