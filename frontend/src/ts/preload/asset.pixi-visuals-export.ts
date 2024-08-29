import { Application, Renderer } from 'pixi.js';
import { createBubbleSpriteSheet } from '../game/visuals/sprite/game.visuals.sprite.bubble';

let pixiApp: Application<Renderer>;
export async function appendExportCanvas(): Promise<void> {
    pixiApp = new Application();
    await pixiApp.init({
        width: 800, 
        height: 20,
        antialias: true,
        preserveDrawingBuffer: true,
        backgroundAlpha: 0,
    });
    document.body.appendChild(pixiApp.canvas);
    const pixiCanvas = document.querySelector("#pixicanvas");
    if (pixiCanvas) {
        pixiCanvas.appendChild(pixiApp.canvas);
    }
}

export function showBubbleSpriteSheet(): void {
    const bubbles = createBubbleSpriteSheet();
    pixiApp.canvas.width = bubbles.width;
    pixiApp.canvas.height = bubbles.height;
    pixiApp.renderer.resize(bubbles.width, bubbles.height);
    pixiApp.stage.addChild(bubbles);
}

export function openCanvasAsImageInNewTab(): void {
    const link = document.createElement('a');
    link.href = pixiApp.canvas.toDataURL('image/png');
    link.target = '_blank';
    link.click();
}