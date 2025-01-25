import { Sprite } from "pixi.js";
import { Field } from "../_interface/game/field";
import { GameInstance } from "../_interface/game/gameInstance";
import { Row } from "../_interface/game/row";
import { PixiAnimation } from "../_interface/pixiAnimation";
import { bubbleTexture } from "../pixi/allTextures";

export function addGridBubbleAnimation(instance: GameInstance): void {
    const animation: PixiAnimation = {
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            console.log("start");
        },
        renderFrame: function (currentTime: number): void {
            const rows: Row[] = instance.playGrid.rows;
            rows.forEach(row => {
                const fields: Field[] = row.fields;
                fields.forEach(field => {
                    if (field.bubble) {
                        const bubble = new Sprite(bubbleTexture.texture)
                        bubble.tint = field.bubble.tint;
                        bubble.width = instance.
                    }

                });
            });
        },
        onEnd: function (): void {
            console.log("end");
        }
    }
    instance.instanceAnimations.push(animation);
}