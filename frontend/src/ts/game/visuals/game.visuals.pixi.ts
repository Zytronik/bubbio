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
        // backgroundAlpha: 0,
        backgroundColor: 0x666666,
    });
    await Assets.load(allAssets)
}

export function appendPixiCanvas(): void {
    document.body.appendChild(pixiApp.canvas);
    const pixiCanvas = document.querySelector("#pixicanvas");
    if (pixiCanvas) {
        pixiCanvas.appendChild(pixiApp.canvas);
        drawBubbleGraphic();
        drawBubbleSprite();
    }

    function drawBubbleSprite(): void {
        const bubble = Sprite.from(WHITE_BUBBLE);
        bubble.width = 40;
        bubble.height = 40;
        pixiApp.stage.addChild(bubble);
    }

    function drawBubbleGraphic(): void {
        const bubble = createBubbleSprite();
        bubble.x = bubble.width * 3 / 2;
        bubble.y = bubble.height / 2;
        // pixiApp.canvas.width = bubble.width;
        // pixiApp.canvas.height = bubble.height;
        // pixiApp.renderer.resize(bubble.width, bubble.height);
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
const WHITE_BUBBLE = "whiteBubble";
const allAssets = [
    { alias: WHITE_BUBBLE, src: require('@/img/sprite/white.png') },
];