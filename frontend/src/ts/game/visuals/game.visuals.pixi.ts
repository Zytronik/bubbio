import { Application, Renderer } from 'pixi.js';
import { createBubbleSprite } from './sprite/game.visuals.sprite.bubble';

let pixiApp: Application<Renderer>;
export async function setupPixiAssets(): Promise<void> {
    pixiApp = new Application();
    await pixiApp.init({
        background: '#555555',
        resizeTo: window,
        antialias: true,
        preserveDrawingBuffer: true
    });
}

export function appendPixiCanvas(): void {
    document.body.appendChild(pixiApp.canvas);
    const pixiCanvas = document.querySelector("#pixicanvas");
    if (pixiCanvas) {
        pixiCanvas.appendChild(pixiApp.canvas);
        const bubble = createBubbleSprite();
        bubble.x = bubble.width / 2;
        bubble.y = bubble.height / 2;
        pixiApp.canvas.width = bubble.width;
        pixiApp.canvas.height = bubble.height;
        pixiApp.stage.addChild(bubble);
    }
}

export function openCanvasAsImageInNewTab(): void {
    const link = document.createElement('a');
    link.href = pixiApp.canvas.toDataURL('image/png');
    link.target = '_blank';
    link.click();
}

/*
ticker for animations in pixi
i would like to have a generic animation interface
each frame would check the status of my game, update visuals and trigger animations
*/