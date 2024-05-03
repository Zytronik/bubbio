import { Application, Assets, Renderer, Sprite } from 'pixi.js';
import { createBubbleSprite } from './sprite/game.visuals.sprite.bubble';

let pixiApp: Application<Renderer>;
export async function setupPixiAssets(): Promise<void> {
    pixiApp = new Application();
    await pixiApp.init({
        width: 800, 
        height: 600,
        antialias: true,
        preserveDrawingBuffer: true,
        backgroundAlpha: 0,
        // backgroundColor: 0x666666,
    });
    await Assets.load(allAssets)
}

export function appendPixiCanvas(): void {
    document.body.appendChild(pixiApp.canvas);
    const pixiCanvas = document.querySelector("#pixicanvas");
    if (pixiCanvas) {
        pixiCanvas.appendChild(pixiApp.canvas);
        // drawBubbleGraphic();
        // drawBubbleSprite();
    }

    function drawColorAtPosition(x: number, y: number, color: number): void {

    }

    function drawBubbleSprite(): void {
        const bubble = Sprite.from(BUBBLES);
        bubble.width = 30;
        bubble.height = 30;
        pixiApp.stage.addChild(bubble);
    }

    function drawBubbleGraphic(): void {
        const bubbles = createBubbleSprite();
        pixiApp.canvas.width = bubbles.width;
        pixiApp.canvas.height = bubbles.height;
        pixiApp.renderer.resize(bubbles.width, bubbles.height);
        pixiApp.stage.addChild(bubbles);
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
const BUBBLES = "allBubbles";
const allAssets = [
    { alias: BUBBLES, src: require('@/img/sprite/bubble_sprite_sheet.png') },
];