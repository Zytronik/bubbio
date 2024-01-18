import { Bubble } from "./i/gameplay.i.bubble";

export function getBubbleByType(typeCode: number): Bubble {
    return allBubbles[typeCode];
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
