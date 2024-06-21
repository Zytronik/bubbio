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

//https://coolors.co/530e58-455ba6-a2ea6f-f6cd29-ea5151-fff3fe-6adaca
//https://ivomynttinen.com/content/3-blog/20150928-ios-design-guidelines/ios-color-theme.jpg
const red: Bubble = {
    ascii: `<div class="field bubble" style="background: #ff4539; border-color: #ff4539;"></div>`,
    type: 0,
}
const orange: Bubble = {
    ascii: `<div class="field bubble" style="background: #ff9f0a; border-color: #ff9f0a;"></div>`,
    type: 1,
}
const yellow: Bubble = {
    ascii: `<div class="field bubble" style="background: #ffff12; border-color: #ffff12;"></div>`,
    type: 2,
}
const green: Bubble = {
    ascii: `<div class="field bubble" style=" background: #32d74c; border-color: rgb(9, 100, 0);"></div>`,
    type: 3,
}
const cyan: Bubble = {
    ascii: `<div class="field bubble" style="background: #63d2ff; border-color: #63d2ff;"></div>`,
    type: 4,
}
const purple: Bubble = {
    ascii: `<div class="field bubble" style=" background: #bf5bf3; border-color: #bf5bf3;"></div>`,
    type: 5,
}
const white: Bubble = {
    ascii: `<div class="field bubble" style=" background: rgb(255, 255, 255); border-color: rgb(99, 99, 99);"></div>`,
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
