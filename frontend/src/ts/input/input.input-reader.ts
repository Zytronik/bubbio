import { Input } from "./i/input.i.input";
import { allInputs, defaultBlocker } from "./input.all-inputs";

let hasAttachedAlready = false;

export function attachInputReader() {
    if (!hasAttachedAlready) {
        document.addEventListener("keydown", (event) => handleKeyDown(event));
        document.addEventListener("keydown", (event) => preventDefaults(event));
        document.addEventListener("keyup", (event) => handleKeyUp(event));
        hasAttachedAlready = true;
        handleHeldDownKeys();
    }
}

function handleKeyDown(event: KeyboardEvent): void {
    allInputs.forEach((input: Input) => {
        input.customKeyMap.forEach((customCode: string) => {
            if (event.code === customCode && !input.pressed && input.enabled) {
                event.preventDefault();
                event.stopPropagation();
                input.pressed = true;
                input.lastFiredAtTime = performance.now();
                input.fire();
            }
        });
    });
}

function preventDefaults(event: KeyboardEvent): void {
    if (defaultBlocker.enabled) {
        defaultBlocker.customKeyMap.forEach((customCode: string) => {
            if (event.code === customCode) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
        });
    }
}

function handleKeyUp(event: KeyboardEvent): void {
    allInputs.forEach((input: Input) => {
        input.customKeyMap.forEach((key: string) => {
            if (event.code === key && input.enabled) {
                event.preventDefault();
                event.stopPropagation();
                input.pressed = false;
                input.releasedAtTime = performance.now();
                if (input.release) {
                    input.release();
                }
            }
        });
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
