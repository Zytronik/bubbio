import { Application, Renderer } from 'pixi.js';

let pixiApp: Application<Renderer>;
export async function setupPixiAssets(): Promise<void> {
    pixiApp = new Application();
    await pixiApp.init({ background: '#1099bb', resizeTo: window });
}

export function appendPixiCanvas(): void {
    document.body.appendChild(pixiApp.canvas);
    const pixiCanvas = document.querySelector("#pixicanvas");
    if (pixiCanvas) {
        pixiCanvas.appendChild(pixiApp.canvas);
    }
}