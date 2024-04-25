import { Application } from 'pixi.js';

export async function setupPixiCanvas(): Promise<void> {
    console.log("asdf")
    const app = new Application();
    await app.init({ background: '#1099bb', resizeTo: window });
    document.body.appendChild(app.canvas);
    const pixiCanvas = document.querySelector("#pixicanvas");
    if (pixiCanvas) {
        pixiCanvas.appendChild(app.canvas);
    }
}