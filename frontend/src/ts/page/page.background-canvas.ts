import { Application, Assets, Container, Sprite, Texture } from "pixi.js";

export let backgroundCanvasApp: Application;
export let backgroundCanvasAssets: Texture;

export async function loadBackgroundCanvas(): Promise<void> {
    if(!backgroundCanvasApp || !backgroundCanvasAssets){
        backgroundCanvasApp = new Application();
        
        await backgroundCanvasApp.init({ background: 'rgb(100, 100, 100)', resizeTo: window });
        backgroundCanvasAssets = await Assets.load('https://pixijs.com/assets/bunny.png');

        setupBackgroundCanvas();
    }
    
    appendBackgroundCanvas();
}

function appendBackgroundCanvas() {
    const backgroundCanvas = document.getElementById('backgroundCanvas');
    if(backgroundCanvas?.querySelector('canvas')){
        return;
    }
    backgroundCanvas?.appendChild(backgroundCanvasApp.canvas);
}

function setupBackgroundCanvas() {
    const container = new Container();

    backgroundCanvasApp.stage.addChild(container);

    // Create a 5x5 grid of bunnies in the container
    for (let i = 0; i < 25; i++) {
        const bunny = new Sprite(backgroundCanvasAssets);
        bunny.width = 100;
        bunny.height = 100;
        bunny.x = (i % 5) * 100;
        bunny.y = Math.floor(i / 5) * 100;
        container.addChild(bunny);
    }

    // Move the container to the center
    container.x = backgroundCanvasApp.screen.width / 2;
    container.y = backgroundCanvasApp.screen.height / 2;

    // Center the bunny sprites in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    // Listen for animate update
    backgroundCanvasApp.ticker.add((time) => {
        // Continuously rotate the container!
        // * use delta to create frame-independent transform *
        container.rotation -= 0.01 * time.deltaTime;
    });
}