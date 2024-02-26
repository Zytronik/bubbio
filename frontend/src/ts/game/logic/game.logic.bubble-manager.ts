import { convertSeedToRandomNumber, getNextSeed } from "./game.logic.random";
import { Bubble } from "../i/game.i.bubble";

export function setupBubbleQueueAndCurrent(seed: number, currentBubble: Bubble, queue: Bubble[], queueLength: number): number {
    let randomIndex = convertSeedToRandomNumber(0, allBubbles.length, seed);
    currentBubble = allBubbles[randomIndex];

    let nextSeed = seed;
    for (let i = 0; i < queueLength; i++) {
        nextSeed = getNextSeed(nextSeed);
        randomIndex = convertSeedToRandomNumber(0, allBubbles.length, nextSeed);
        queue.push(allBubbles[randomIndex]);
    }

    nextSeed = getNextSeed(nextSeed);
    return nextSeed;
}

export function holdBubble(currentBubble: Bubble, heldBubble: Bubble, queue: Bubble[], seed: number): number {
    if (!heldBubble) {
        const randomIndex = convertSeedToRandomNumber(0, allBubbles.length, seed);
        queue.push(allBubbles[randomIndex]);
        heldBubble = currentBubble;
        currentBubble = queue.shift() as Bubble;
        return getNextSeed(seed);
    }
    const temp = currentBubble;
    currentBubble = heldBubble;
    heldBubble = temp;
    return seed;
}

export function updateBubbleQueueAndCurrent(currentBubble: Bubble, queue: Bubble[], seed: number): number {
    const randomIndex = convertSeedToRandomNumber(0, allBubbles.length, seed);
    queue.push(allBubbles[randomIndex]);
    currentBubble = queue.shift() as Bubble;
    return getNextSeed(seed);
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
