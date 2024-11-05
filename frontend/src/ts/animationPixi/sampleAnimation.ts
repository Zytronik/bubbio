import { Sprite } from "pixi.js";
import { thisIsASprite } from "../pixi/allTextures";
import { PixiAnimation } from "../_interface/pixiAnimation";
import { mainContainer } from "../pixi/containers";
import { addPixiAnimation, getLerpT } from "../pixi/animation";

export function playExample(): void {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const now = performance.now();
    const duration = 2000;
    const flipAmount = 3;
    const bunny = new Sprite(thisIsASprite.texture);
    bunny.anchor.set(0.5);

    const exampleAnim: PixiAnimation = {
        startMS: now,
        endMS: now + duration,
        onStart: function (): void {
            mainContainer.addChild(bunny);
        },
        renderFrame: function (currentTime: number): void {
            const currentAngle = getLerpT(this.startMS, this.endMS, currentTime) * flipAmount * 360;
            bunny.x = x;
            bunny.y = y;
            bunny.angle = currentAngle;
        },
        onEnd: function (): void {
            mainContainer.removeChild(bunny);
        },
    }
    addPixiAnimation(exampleAnim);
}