import { Application } from "pixi.js";

export async function setupPixi(): Promise<void> {
    console.log("a1")
    const CANVAS_ID = "#pixiCanvas";
    const pixiApp = new Application();

    await pixiApp.init({
        background: '#1099bb',
        resizeTo: window,
    });
    console.log("a2")
    document.querySelector(CANVAS_ID)?.appendChild(pixiApp.canvas);
    console.log("a3")
}