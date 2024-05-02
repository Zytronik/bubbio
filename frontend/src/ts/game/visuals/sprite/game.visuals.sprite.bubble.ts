import { Graphics } from "pixi.js";

const outerRadius = 200;
const innerRadius = 150;
const colorWhite = 0xFFFFFF;
const colorRed = 0xFF0000;
const colorOrange = 0xFFA500;
const colorYellow = 0xFFFF00;
const colorGreen = 0x00FF00;
const colorCyan = 0x00FFFF;
const colorPurple = 0x800080;
const colorBlack = 0x000000;

export function createBubbleSprite(): Graphics {
    return new Graphics()
    .circle(0, 0, outerRadius)
    .fill({color: colorBlack})
    .circle(0, 0, innerRadius)
    .fill({color: colorRed});
}
