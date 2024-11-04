import { Text } from "pixi.js";
import { countDownContainer } from "../pixi/containers";
import { countDownFont } from "../pixi/allFonts";
import { PixiAnimation } from "../_interface/pixiAnimation";
import { addPixiAnimation, getLerpT } from "../pixi/animation";
import { usePixiStore } from "@/stores/pixiStore";

export function playCountdown() {
    const duration = 2000;
    const now = performance.now();
    const three = new Text({
        text: '3',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 800,
        }
    });
    const two = new Text({
        text: '2',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 800,
        }
    });
    const one = new Text({
        text: '1',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 800,
        }
    });
    const go = new Text({
        text: 'GO',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 1600,
        }
    });
    const threeTravelDistance = three.height / 2 + usePixiStore().getCanvasHeight() / 2;
    const countdownAnimation: PixiAnimation = {
        startMS: now,
        endMS: now + duration,
        sprites: [],
        texts: [go, one, two, three],
        container: countDownContainer,
        attributes: [0.2, 0.4, 0.6, 0.8, threeTravelDistance],
        onStart: function (): void {
            this.container.visible = true;
            this.texts.forEach(text => {
                text.visible = false;
                text.anchor.set(0.5);
                text.x = usePixiStore().getCanvasWidth() / 2;
                text.y = usePixiStore().getCanvasHeight() / 2;
                this.container.addChild(text);
            });
            three.y = -(three.height / 2);
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            const threeDownDuration = this.attributes[0];
            const threeDuration = this.attributes[1];
            const twoDuration = this.attributes[2];
            const oneDuration = this.attributes[3];
            const goDuration = 1;
            const three = this.texts[3];
            const two = this.texts[2];
            const one = this.texts[1];
            const go = this.texts[0];
            if (t < threeDownDuration) {
                const travelDistance = this.attributes[4];
                const travelT = getLerpT(0, threeDownDuration, t);
                three.visible = true;
                three.y = -(three.height / 2) + travelT * travelDistance
            }
            else if (t < threeDuration) {
                three.visible = true;
                const shrinkT = getLerpT(threeDownDuration, threeDuration, t);
                three.scale = 1 - (shrinkT * 0.2);
            }
            else if (t < twoDuration) {
                three.visible = false;
                two.visible = true;
                const shrinkT = getLerpT(threeDuration, twoDuration, t);
                two.scale = 1 - (shrinkT * 0.2);
            }
            else if (t < oneDuration) {
                two.visible = false;
                one.visible = true;
                const shrinkT = getLerpT(twoDuration, oneDuration, t);
                one.scale = 1 - (shrinkT * 0.2);
            }
            else if (t < goDuration) {
                one.visible = false;
                go.visible = true;
                const shrinkT = getLerpT(oneDuration, goDuration, t);
                go.scale = 1 - (shrinkT * 1);
            }
        },
        onEnd: function (): void {
            this.container.visible = false;
            this.texts.forEach(text => {
                this.container.removeChild(text);
            });
        }
    }
    addPixiAnimation(countdownAnimation);
}