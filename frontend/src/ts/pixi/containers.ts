import { usePixiStore } from "@/stores/pixiStore";
import { Container } from "pixi.js";

export const mainContainer = new Container();
export const countDownContainer = new Container({visible: false});

export function setupPixiContainers(): void {
    const stage = usePixiStore().getPixiApp().stage;
    stage.addChild(mainContainer);
    countDownContainer.visible = false;
    mainContainer.addChild(countDownContainer);
}