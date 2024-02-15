import { convertSeedToRandomNumber, getNextSeed } from "./gameplay.random";
import { Bubble } from "./i/gameplay.i.bubble";

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

export function holdFirstBubble(currentBubble: Bubble, heldBubble: Bubble, queue: Bubble[], seed: number): number {
    heldBubble = currentBubble;
    currentBubble = queue.shift();
    let randomIndex = convertSeedToRandomNumber(0, allBubbles.length, seed);
    queue.push(allBubbles[randomIndex]);
    return getNextSeed(seed);
}

export function holdBubble(currentBubble: Bubble, heldBubble: Bubble): void {
    let temp = currentBubble;
    currentBubble = heldBubble;
    heldBubble = temp;

}

export function updateCurrentBubble(currentBubble: Bubble, queue: Bubble[], seed: number): number {
    currentBubble = queue.shift();
    let randomIndex = convertSeedToRandomNumber(0, allBubbles.length, seed);
    queue.push(allBubbles[randomIndex]);
    return getNextSeed(seed);
}


const red: Bubble = {
    type: 0,
}
const orange: Bubble = {
    type: 1,
}
const yellow: Bubble = {
    type: 2,
}
const green: Bubble = {
    type: 3,
}
const cyan: Bubble = {
    type: 4,
}
const magenta: Bubble = {
    type: 5,
}
const white: Bubble = {
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
