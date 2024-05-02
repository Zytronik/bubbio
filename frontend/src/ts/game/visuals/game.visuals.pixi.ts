import { Application, Assets, Renderer, Sprite } from 'pixi.js';
import { createBubbleSprite } from './sprite/game.visuals.sprite.bubble';

let pixiApp: Application<Renderer>;
export async function setupPixiAssets(): Promise<void> {
    pixiApp = new Application();
    await pixiApp.init({
        resizeTo: window,
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
        pixiApp.canvas.width = 500;
        pixiApp.canvas.height = 500;
        // drawBubbleGraphic(pixiCanvas);
        // drawBubbleSprite();
    }

    function drawBubbleSprite(): void {
        const bubbleSprite = Sprite.from(WHITE_BUBBLE);
        bubbleSprite.anchor.set(0.5);
        bubbleSprite.x = bubbleSprite.width / 2;
        bubbleSprite.y = bubbleSprite.height / 2;
        pixiApp.stage.addChild(bubbleSprite);
    }

    function drawBubbleGraphic(canvas: Element): void {
        canvas.appendChild(pixiApp.canvas);
        const bubble = createBubbleSprite();
        bubble.x = bubble.width / 2;
        bubble.y = bubble.height / 2;
        pixiApp.canvas.width = bubble.width;
        pixiApp.canvas.height = bubble.height;
        pixiApp.renderer.resize(bubble.width, bubble.height);
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