import { Input } from "./input.i-input";
import { allInputs } from "./input.possible-inputs";

let hasAttachedAlready = false;

export function attachInputReader() {
    if (!hasAttachedAlready) {
        document.addEventListener("keydown", (event) => handleKeyDown(event));
        document.addEventListener("keyup", (event) => handleKeyUp(event));
        hasAttachedAlready = true;
        handleHeldDownKeys();
    }
}

function handleKeyDown(event: KeyboardEvent): void {
    allInputs.forEach((input: Input) => {
        if (event.code === input.defaultKeyCode && !input.pressed && input.enabled) {
            input.pressed = true;
            input.lastFiredAtTime = performance.now();
            input.fire();
        }
    });
}

function handleKeyUp(event: KeyboardEvent): void {
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

function handleHeldDownKeys(): void {
    allInputs.forEach((input: Input) => {
        if (!input.isTrigger && input.pressed && input.enabled) {
            input.fire();
            input.lastFiredAtTime = performance.now();
        }
    });
    requestAnimationFrame(() => handleHeldDownKeys());
}
