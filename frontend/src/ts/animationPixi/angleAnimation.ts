import { PixiAnimation } from "../_interface/pixiAnimation";
import { GameInstance } from "../_interface/game/gameInstance";

export function addAngleUpdateAnimation(instance: GameInstance): void {
    const container = instance.gameContainers.cursor;
    const arrow = instance.gameSprites.arrow;
    container.addChild(arrow);
    arrow.x = 0;
    arrow.y = 0;
    arrow.height = 30;
    arrow.width = 30;
    arrow.anchor.set(0.5);
    
    const animation: PixiAnimation = {
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            console.log("start");
        },
        renderFrame: function (currentTime: number): void {
            arrow.angle = instance.angle;
        },
        onEnd: function (): void {
            console.log("end");
        }
    }
    instance.instanceAnimations.push(animation);
}