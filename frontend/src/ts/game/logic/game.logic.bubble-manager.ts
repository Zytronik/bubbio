import { convertSeedToRandomNumber, getNextSeed } from "./game.logic.random";
import { Bubble } from "../i/game.i.bubble";
import { GameInstance } from "../i/game.i.game-instance";

export function holdBubble(gameInstance: GameInstance): void {
    if (!gameInstance.holdBubble) {
        const randomIndex = convertSeedToRandomNumber(0, allBubbles.length, gameInstance.bubbleSeed);
        gameInstance.bubbleSeed = getNextSeed(gameInstance.bubbleSeed);
        gameInstance.bubbleQueue.push(allBubbles[randomIndex]);
        gameInstance.holdBubble = gameInstance.currentBubble;
        gameInstance.currentBubble = gameInstance.bubbleQueue.shift() as Bubble;
    } else {
        const temp = gameInstance.currentBubble;
        gameInstance.currentBubble = gameInstance.holdBubble as Bubble;
        gameInstance.holdBubble = temp;
    }
}

export function updateBubbleQueueAndCurrent(gameInstance: GameInstance): void {
    const queueLength = gameInstance.gameSettings.queuePreviewSize;
    while (gameInstance.bubbleQueue.length <= queueLength) {
        gameInstance.bubbleQueue.push(...getBubbleBag(gameInstance));
    }
    gameInstance.currentBubble = gameInstance.bubbleQueue.shift() as Bubble;
}

function getBubbleBag(gameInstance: GameInstance): Bubble[] {
    const bagSize = gameInstance.gameSettings.bubbleBagSize;
    const bag: Bubble[] = [];
    const leftOverBubbles = [...allBubbles];
    while (bag.length < bagSize) {
        if (leftOverBubbles.length === 0) {
            leftOverBubbles.push(...allBubbles);
        }
        const randomIndex = convertSeedToRandomNumber(0, leftOverBubbles.length, gameInstance.bubbleSeed);
        gameInstance.bubbleSeed = getNextSeed(gameInstance.bubbleSeed);
        bag.push(leftOverBubbles.splice(randomIndex, 1)[0]);
    }
    return bag;
}


const red: Bubble = {
    ascii: `<div class="field bubble" style="background: #EA5151; border-color: #EA5151;"></div>`,
    type: 0,
}
const orange: Bubble = {
    ascii: `<div class="field bubble" style="background: #F6CD29; border-color: #3d330c;"></div>`,
    type: 1,
}
const yellow: Bubble = {
    ascii: `<div class="field bubble" style="background: #A2EA6F; border-color: #354d24;"></div>`,
    type: 2,
}
const green: Bubble = {
    ascii: `<div class="field bubble" style=" background: #6ADACA; border-color: #6ADACA;"></div>`,
    type: 3,
}
const cyan: Bubble = {
    ascii: `<div class="field bubble" style="background: #455BA6; border-color: #455BA6;"></div>`,
    type: 4,
}
const purple: Bubble = {
    ascii: `<div class="field bubble" style=" background: #530E58; border-color: #530E58;"></div>`,
    type: 5,
}
const white: Bubble = {
    ascii: `<div class="field bubble" style=" background: #FFF0FA; border-color: #280027;"></div>`,
    type: 6,
}
export const allBubbles: Bubble[] = [
    red,
    orange,
    yellow,
    green,
    cyan,
    purple,
    white,
]
