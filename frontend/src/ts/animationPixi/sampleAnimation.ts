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
        sprites: [
            bunny,
        ],
        texts: [],
        container: mainContainer,
        attributes: [x, y, flipAmount],
        onStart: function (): void {
            this.container.addChild(this.sprites[0]);
        },
        renderFrame: function (currentTime: number): void {
            const bunny = this.sprites[0];
            const x = this.attributes[0];
            const y = this.attributes[1];
            const currentAngle = getLerpT(this.startMS, this.endMS, currentTime) * flipAmount * 360;
            bunny.x = x;
            bunny.y = y;
            bunny.angle = currentAngle;
        },
        onEnd: function (): void {
            this.sprites.forEach(sprite => {
                this.container.removeChild(sprite);
            });
        },
    }
    addPixiAnimation(exampleAnim);
}