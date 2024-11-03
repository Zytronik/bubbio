import { Sprite } from "pixi.js";
import { PixiAnimation } from "../_interface/pixiAnimation";
import { thisIsASprite } from "./textureReference";
import { mainContainer } from "./containers";

const ongoingAnimations: PixiAnimation[] = [];
export function animationLoop(): void {
    const now = performance.now();
    for (let i = ongoingAnimations.length - 1; i >= 0; i--) {
        const animation = ongoingAnimations[i];
        if (animation.endMS < now) {
            animation.onEnd();
            ongoingAnimations.splice(i, 1);
        } else {
            animation.renderFrame(now);
        }
    }
    requestAnimationFrame(() => animationLoop());
}

export function addPixiAnimation(animation: PixiAnimation) {
    animation.onStart();
    ongoingAnimations.push(animation);
}

export function getLerpT(startMS: number, endMS: number, currentMS: number): number {
    const duration = endMS - startMS;
    const progress = currentMS - startMS
    return progress / duration;
}

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
        container: mainContainer,
        attributes: [x, y, flipAmount],
        onStart: function (): void {
            this.container.addChild(this.sprites[0]);
        },
        renderFrame: function (currentTime: number): void {
            const bunny = this.sprites[0];
            const x = this.attributes[0];
            const y = this.attributes[1];
            const currentAngle = getLerpT(this.startMS, this.endMS, performance.now()) * flipAmount * 360;
            bunny.x = x;
            bunny.y = y;
            bunny.angle = currentAngle
        },
        onEnd: function (): void {
            this.sprites.forEach(sprite => {
                this.container.removeChild(sprite);
            })
        }
    }
    addPixiAnimation(exampleAnim);
}