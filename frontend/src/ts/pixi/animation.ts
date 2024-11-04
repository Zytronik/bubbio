import { PixiAnimation } from "../_interface/pixiAnimation";

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