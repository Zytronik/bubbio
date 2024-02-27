import { convertSeedToRandomNumber, getNextSeed } from "./game.logic.random";
import { Bubble } from "../i/game.i.bubble";
import { GameInstance } from "../i/game.i.game-instance";

export function setupBubbleQueueAndCurrent(gameInstance: GameInstance): void {
    const currentSeed = gameInstance.currentSeed;
    let randomIndex = convertSeedToRandomNumber(0, allBubbles.length, currentSeed);
    gameInstance.currentBubble = allBubbles[randomIndex];

    let nextSeed = currentSeed;
    const queueLength = gameInstance.gameSettings.queuePreviewSize.value;
    for (let i = 0; i < queueLength; i++) {
        nextSeed = getNextSeed(nextSeed);
        randomIndex = convertSeedToRandomNumber(0, allBubbles.length, nextSeed);
        gameInstance.bubbleQueue.push(allBubbles[randomIndex]);
    }

    nextSeed = getNextSeed(nextSeed);
    gameInstance.currentSeed = nextSeed;
}

export function holdBubble(gameInstance: GameInstance): void {
    if (!gameInstance.holdBubble) {
        const randomIndex = convertSeedToRandomNumber(0, allBubbles.length, gameInstance.currentSeed);
        gameInstance.bubbleQueue.push(allBubbles[randomIndex]);
        gameInstance.holdBubble = gameInstance.currentBubble;
        gameInstance.currentBubble = gameInstance.bubbleQueue.shift() as Bubble;
        gameInstance.currentSeed = getNextSeed(gameInstance.currentSeed);
    } else {
        const temp = gameInstance.currentBubble;
        gameInstance.currentBubble = gameInstance.holdBubble as Bubble;
        gameInstance.holdBubble = temp;
    }
}

export function updateBubbleQueueAndCurrent(gameInstance: GameInstance): void {
    const randomIndex = convertSeedToRandomNumber(0, allBubbles.length, gameInstance.currentSeed);
    gameInstance.bubbleQueue.push(allBubbles[randomIndex]);
    gameInstance.currentBubble = gameInstance.bubbleQueue.shift() as Bubble;
    gameInstance.currentSeed = getNextSeed(gameInstance.currentSeed);
}


const red: Bubble = {
    color: "rgb(255, 0, 0)",
    ascii: `<span style="color: rgb(255, 0, 0);">R</span>`,
    type: 0,
}
const orange: Bubble = {
    color: "rgb(255, 174, 0)",
    ascii: `<span style="color: rgb(255, 174, 0);">O</span>`,
    type: 1,
}
const yellow: Bubble = {
    color: "rgb(255, 255, 0)",
    ascii: `<span style="color: rgb(255, 255, 0);">Y</span>`,
    type: 2,
}
const green: Bubble = {
    color: "rgb(123, 255, 0)",
    ascii: `<span style="color: rgb(123, 255, 0);">G</span>`,
    type: 3,
}
const cyan: Bubble = {
    color: "rgb(0, 255, 255)",
    ascii: `<span style="color: rgb(0, 255, 255);">B</span>`,
    type: 4,
}
const magenta: Bubble = {
    color: "rgb(255, 0, 255)",
    ascii: `<span style="color: rgb(255, 0, 255);">P</span>`,
    type: 5,
}
const white: Bubble = {
    color: "rgb(255, 255, 255)",
    ascii: `<span style="color: rgb(255, 255, 255);">W</span>`,
    type: 6,
}
const allBubbles: Bubble[] = [
    red,
    orange,
    yellow,
    green,
    cyan,
    magenta,
    white,
]
