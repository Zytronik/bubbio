import { Input } from "./input.i-input";
import { allInputs } from "./input.possible-inputs";

let hasAttachedAlready = false;
export class InputReader {

    constructor() {
        if (!hasAttachedAlready) {
            document.addEventListener("keydown", (event) => this.handleKeyDown(event));
            document.addEventListener("keyup", (event) => this.handleKeyUp(event));
            hasAttachedAlready = true;
        }
        this.handleHeldDownKeys();
    }

    private handleKeyDown(event: KeyboardEvent): void {
        allInputs.forEach((input: Input) => {
            if (event.code === input.defaultKeyCode && !input.pressed && input.enabled) {
                input.pressed = true;
                input.lastFiredAtTime = performance.now();
                input.fire();
            }
        });
    }

    private handleKeyUp(event: KeyboardEvent): void {
        allInputs.forEach((input: Input) => {
            if (event.code === input.defaultKeyCode && input.enabled) {
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
            if (!input.isTrigger && input.pressed && input.enabled) {
                input.fire();
                input.lastFiredAtTime = performance.now();
            }
        });
        requestAnimationFrame(() => this.handleHeldDownKeys());
    }
}
