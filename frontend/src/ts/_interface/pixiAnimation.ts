import { Container, Sprite } from "pixi.js";

export interface PixiAnimation {
    startMS: number,
    endMS: number,
    sprites: Sprite[],
    container: Container,
    attributes: number[],
    onStart: () => void,
    renderFrame: (currentTime: number) => void,
    onEnd: () => void,
}