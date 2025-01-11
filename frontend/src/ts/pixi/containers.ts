import { usePixiStore } from "@/stores/pixiStore";
import { Container, Graphics } from "pixi.js";
import { useGameStore } from "@/stores/gameStore";
import { GameInstance } from "../_interface/game/gameInstance";
import { getRandomHexColor } from "./color";

export const mainContainer = new Container();
export const gameContainer = new Container({ visible: false });
export const countDownContainer = new Container({ visible: false });

export function setupPixiContainers(): void {
    const stage = usePixiStore().getPixiApp().stage;
    stage.addChild(mainContainer);
    mainContainer.addChild(gameContainer);
    mainContainer.addChild(countDownContainer);
}

export function createGameInstanceContainer(): Container {
    const maxWidthPercentage = 0.35;
    const height = usePixiStore().getCanvasHeight();
    const width = usePixiStore().getCanvasWidth();
    const container = new Container({ visible: true });
    const testSquare = new Graphics();
    testSquare.rect(0, 0, width * maxWidthPercentage, height * 0.9);
    testSquare.fill(getRandomHexColor());
    container.addChild(testSquare);
    gameContainer.addChild(container);
    return container;
}

export function updateContainerLayout(): void {
    const instances: GameInstance[] = useGameStore().getAllInstances();
    const pixiContainers: Container[] = [];
    instances.forEach(instance => {
        pixiContainers.push(instance.animationContainer);
    });

    if (pixiContainers.length === 1) gameLayoutSolo(pixiContainers);
    if (pixiContainers.length === 2) gameLayout1vs1(pixiContainers);
    if (pixiContainers.length > 2) gameLayout1vsX(pixiContainers); 
}

// function testingThings(): void {
//     const height = usePixiStore().getCanvasHeight();
//     const width = usePixiStore().getCanvasWidth();
//     for (let i = 0; i < playerCount; i++) {
//         manyPlayerContainers.push(new Container({ visible: false }));
//         const testSquare = new Graphics();
//         testSquare.rect(0, 0, width * maxWidthPercentage, height * 0.9);
//         testSquare.fill(getRandomHexColor());
//         manyPlayerContainers[i].addChild(testSquare);
//         gameContainer.addChild(manyPlayerContainers[i]);
//     }
//     gameContainer.visible = true;
// }

function gameLayoutSolo(containers: Container[]): void {
    const canvasWidth = usePixiStore().getCanvasWidth();
    const canvasHeight = usePixiStore().getCanvasHeight();
    const player1 = containers[0];
    player1.visible = true;
    //topleft corner of container to middle
    player1.x = canvasWidth * 0.5;
    player1.y = canvasHeight * 0.5;
    //shift content 50% up and left to center children
    player1.pivot.x = player1.width / 2;
    player1.pivot.y = player1.height / 2;
    console.log("Showing Singleplayer Layout");
}

function gameLayout1vs1(containers: Container[]): void {
    const canvasWidth = usePixiStore().getCanvasWidth();
    const canvasHeight = usePixiStore().getCanvasHeight();
    const player1 = containers[0];
    const player2 = containers[1];
    player1.visible = true;
    player1.x = canvasWidth * 0.3;
    player1.y = canvasHeight * 0.5;
    player1.pivot.x = player1.width / 2;
    player1.pivot.y = player1.height / 2;

    player2.visible = true;
    player2.scale = 1
    player2.x = canvasWidth * 0.7;
    player2.y = canvasHeight * 0.5;
    player2.pivot.x = player1.width / 2;
    player2.pivot.y = player1.height / 2;
    player2.scale = 1
    console.log("Showing 2-Player Layout");
}

//not sure about using pivot. its very funky with scale: cant imagine scaling and moving a container as an animation with pivot centering
const RIGHT_SIDE = 0.52;
const RIGHT_SIDE_WIDTH = 0.45;
function gameLayout1vsX(containers: Container[]): void {
    const canvasWidth = usePixiStore().getCanvasWidth();
    const canvasHeight = usePixiStore().getCanvasHeight();
    const player1 = containers[0];
    //e.g. gridSize = 3 -> 3x3 grid
    const gridSize = Math.ceil(Math.sqrt(containers.length - 1));
    player1.visible = true;
    player1.x = canvasWidth * 0.3;
    player1.y = canvasHeight * 0.5;
    player1.pivot.x = player1.width / 2;
    player1.pivot.y = player1.height / 2;
    //orders the enemy players in a square grid on right side
    for (let gridY = 0; gridY < gridSize; gridY++) {
        for (let gridX = 0; gridX < gridSize; gridX++) {
            const i = (gridY * gridSize) + gridX + 1;
            if (i < containers.length) {
                const otherPlayer = containers[i];
                otherPlayer.visible = true;
                otherPlayer.scale = 1
                otherPlayer.x = canvasWidth * (RIGHT_SIDE + (gridX + 0.5) * (RIGHT_SIDE_WIDTH / gridSize));
                otherPlayer.y = canvasHeight * (gridY + 0.5) * (1 / gridSize);
                otherPlayer.pivot.x = otherPlayer.width / 2;
                otherPlayer.pivot.y = otherPlayer.height / 2;
                otherPlayer.scale = 1 / gridSize;
            }
        }
    }
    console.log("Showing 3+ Player Layout");
    console.log("playeramount: ", containers.length, "gridSize: ", gridSize)
}