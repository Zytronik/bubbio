import { XORShift32 } from "./gameplay.random";
import { Bubble } from "./i/gameplay.i.bubble";

export function getBubbleByType(typeCode: number): Bubble {
    return allBubbles[typeCode];
}

const random = new XORShift32();
export function getRandomBubble(): Bubble {
    return allBubbles[random.randomInt(0, allBubbles.length)];
}

const b1: Bubble = {
    color: "Red",
    ascii: "x",
    type: 0,
}
const b2: Bubble = {
    color: "Blue",
    ascii: "o",
    type: 1,
}
const b3: Bubble = {
    color: "Green",
    ascii: "z",
    type: 2,
}
const b4: Bubble = {
    color: "Silver",
    ascii: "s",
    type: 3,
}
const b5: Bubble = {
    color: "White",
    ascii: "u",
    type: 4,
}
const b6: Bubble = {
    color: "Purple",
    ascii: "r",
    type: 5,
}
const b7: Bubble = {
    color: "Black",
    ascii: "n",
    type: 6,
}
const allBubbles: Bubble[] = [
    b1,
    b2,
    b3,
    b4,
    b5,
    b6,
    b7,
]
