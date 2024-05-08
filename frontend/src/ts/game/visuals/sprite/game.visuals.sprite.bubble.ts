/* eslint @typescript-eslint/no-var-requires: "off" */
import { Assets, Container, Graphics, Spritesheet } from "pixi.js";

const d = 300;
const outerRadius = d / 2;
const innerRadius = outerRadius * 4 / 5;
const colorRed = 0xFF0000;
const colorOrange = 0xFFA500;
const colorYellow = 0xFFFF00;
const colorGreen = 0x00FF00;
const colorCyan = 0x00FFFF;
const colorPurple = 0x800080;
const colorWhite = 0xFFFFFF;
const colorBlack = 0x000000;

export function createBubbleSpriteSheet(): Container {
    const allBubbles = new Container();
    const allColors = [colorRed, colorOrange, colorYellow, colorGreen, colorCyan, colorPurple, colorWhite];
    allColors.forEach((color, index) => {
        const bubble = new Graphics()
            .circle(0, 0, outerRadius)
            .fill({ color: colorBlack })
            .circle(0, 0, innerRadius)
            .fill({ color: color });
        bubble.x = index * outerRadius * 2 + outerRadius;
        bubble.y = outerRadius;
        allBubbles.addChild(bubble);
    });
    return allBubbles;
}

export async function loadBubbleSpriteSheet(): Promise<Spritesheet> {
    const texture = await Assets.load(require('@/img/sprite/bubble_sprite_sheet.png'));
    const spritesheet = new Spritesheet(
        texture,
        BUBBLE_SPRITE_SHEET_DATA
    );
    await spritesheet.parse();
    return spritesheet;
}

export const RED_BUBBLE_IDLE = 'redBubbleIdle';
export const ORANGE_BUBBLE_IDLE = 'orangeBubbleIdle';
export const YELLOW_BUBBLE_IDLE = 'yellowBubbleIdle';
export const GREEN_BUBBLE_IDLE = 'greenBubbleIdle';
export const CYAN_BUBBLE_IDLE = 'cyanBubbleIdle';
export const PURPLE_BUBBLE_IDLE = 'purpleBubbleIdle';
export const WHITE_BUBBLE_IDLE = 'whiteBubbleIdle';
const BUBBLE_SPRITE_SHEET_DATA = {
    frames: {
        r1: {
            frame: { x: d * 1, y: 0, w: d, h: d },
            sourceSize: { w: d, h: d },
            spriteSourceSize: { x: 0, y: 0, w: d, h: d }
        },
        o1: {
            frame: { x: d * 2, y: 0, w: d, h: d },
            sourceSize: { w: d, h: d },
            spriteSourceSize: { x: 0, y: 0, w: d, h: d }
        },
        y1: {
            frame: { x: d * 3, y: 0, w: d, h: d },
            sourceSize: { w: d, h: d },
            spriteSourceSize: { x: 0, y: 0, w: d, h: d }
        },
        g1: {
            frame: { x: d * 4, y: 0, w: d, h: d },
            sourceSize: { w: d, h: d },
            spriteSourceSize: { x: 0, y: 0, w: d, h: d }
        },
        c1: {
            frame: { x: d * 5, y: 0, w: d, h: d },
            sourceSize: { w: d, h: d },
            spriteSourceSize: { x: 0, y: 0, w: d, h: d }
        },
        p1: {
            frame: { x: d * 6, y: 0, w: d, h: d },
            sourceSize: { w: d, h: d },
            spriteSourceSize: { x: 0, y: 0, w: d, h: d }
        },
        w1: {
            frame: { x: d * 0, y: 0, w: d, h: d },
            sourceSize: { w: d, h: d },
            spriteSourceSize: { x: 0, y: 0, w: d, h: d }
        },
    },
    meta: {
        format: 'RGBA8888',
        size: { w: d * 7, h: d },
        scale: 1
    },
    animations: {
        [RED_BUBBLE_IDLE]: ['r1'],
        [ORANGE_BUBBLE_IDLE]: ['o1'],
        [YELLOW_BUBBLE_IDLE]: ['y1'],
        [GREEN_BUBBLE_IDLE]: ['g1'],
        [CYAN_BUBBLE_IDLE]: ['c1'],
        [PURPLE_BUBBLE_IDLE]: ['p1'],
        [WHITE_BUBBLE_IDLE]: ['w1'],
    }
}
