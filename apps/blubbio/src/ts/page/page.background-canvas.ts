import { Application, Assets, Sprite, Texture } from "pixi.js";
import { ConvolutionFilter } from "pixi-filters";

export let backgroundCanvasApp: Application;
export let backgroundCanvasAssets: Texture;

export async function loadBackgroundCanvas(): Promise<void> {
    if(!backgroundCanvasApp || !backgroundCanvasAssets){
        backgroundCanvasApp = new Application();
        
        await backgroundCanvasApp.init({resizeTo: window });
        backgroundCanvasAssets = await Assets.load('https://pixijs.com/assets/bunny.png');
        await Assets.load({alias: 'background', src: require('@/img/sprite/1480843698063.jpg')});
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
    const background = Sprite.from('background');
    background.width = backgroundCanvasApp.screen.width;
    background.height = backgroundCanvasApp.screen.height;
    backgroundCanvasApp.stage.addChild(background);
    background.x = 0;
    background.y = 0;

    const convo = new ConvolutionFilter({width: 300, height: 300, matrix: [0,0,0,0,0,0,0,0.1,0.1]});
    backgroundCanvasApp.stage.filters = [convo];

    

    // Create a 5x5 grid of bunnies in the container
    /* for (let i = 0; i < 25; i++) {
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
    }); */
}