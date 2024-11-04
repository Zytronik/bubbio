import { Container, Sprite, Text } from "pixi.js";

export interface PixiAnimation {
    startMS: number,
    endMS: number,
    sprites: Sprite[],
    texts: Text[],
    container: Container,
    attributes: number[],
    onStart: () => void,
    renderFrame: (currentTime: number) => void,
    onEnd: () => void,
}