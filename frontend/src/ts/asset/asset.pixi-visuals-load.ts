import { Spritesheet } from "pixi.js";
import { loadBubbleSpriteSheet } from "../game/visuals/sprite/game.visuals.sprite.bubble";

export let bubbleSpriteSheet: Spritesheet;
export async function loadAllAssets(): Promise<void> {
    bubbleSpriteSheet = await loadBubbleSpriteSheet();
}