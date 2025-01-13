import { Container } from "pixi.js";

export interface GameContainers {
    setupCanvasHeight: number,
    setupCanvasWidth: number,
    instanceRoot: Container,
    grid: Container,
    cursor: Container,
}