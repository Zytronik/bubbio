import { Input } from "./input.i-input";
import { allInputs } from "./input.possible-inputs";

export class InputReader {
    private hasAttachedAlready = false;

    constructor() {
        if (!this.hasAttachedAlready) {
            document.addEventListener("keydown", (event) => this.handleKeyDown(event));
            document.addEventListener("keyup", (event) => this.handleKeyUp(event));
            this.hasAttachedAlready = true;
        }
        this.handleHeldDownKeys();
    }

    private handleKeyDown(event: KeyboardEvent): void {
        allInputs.forEach((input: Input) => {
            if (event.code === input.defaultKeyCode) {
                input.pressed = true;
                input.lastFiredAtTime = performance.now();
                input.fire();
            }
        });
    }

    private handleKeyUp(event: KeyboardEvent): void {
        allInputs.forEach((input: Input) => {
            if (event.code === input.defaultKeyCode) {
                input.pressed = false;
                input.releasedAtTime = performance.now();
                if (input.release) {
                    input.release();
                }
            }
        });
    }

    private handleHeldDownKeys(): void {
        allInputs.forEach((input: Input) => {
            if (!input.isTrigger && input.pressed) {
                input.fire();
                input.lastFiredAtTime = performance.now();
            }
        });
        requestAnimationFrame(() => this.handleHeldDownKeys());
    }
}
