import { XORShift32 } from "./gameplay.random";
import { Bubble } from "./i/gameplay.i.bubble";

export function getBubbleByType(typeCode: number): Bubble {
    return allBubbles[typeCode];
}

export function getBubbleQueue(): void {
    //TODO RNG from backend
    prepareNextBubble();
}

const random = new XORShift32();
export function getRandomBubble(): Bubble {
    return allBubbles[random.randomInt(0, allBubbles.length)];
}
let currentBubble: Bubble;
export function getCurrentBubble(): Bubble {
    return currentBubble;
}
export function prepareNextBubble(): void {
    currentBubble = getRandomBubble();
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
