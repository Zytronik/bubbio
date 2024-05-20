import { Input } from "./i/input.i.input";
import { allInputs, defaultBlocker } from "./input.all-inputs";

let hasAttachedAlready = false;
let canUseGamepad = false;
export function attachInputReader() {
    if (!hasAttachedAlready) {
        document.addEventListener("keydown", (event) => handleKeyDown(event));
        document.addEventListener("keydown", (event) => preventDefaults(event));
        document.addEventListener("keyup", (event) => handleKeyUp(event));
        if ('getGamepads' in navigator) {
            canUseGamepad = true;
        } else {
            console.error("Browser does not support gamepad API");
        }
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
                input.lastFiredAtTime = performance.now();
                input.fire();
                input.pressed = true;
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
        if (input.enabled) {
            if (!input.isSingleTriggerAction && input.pressed) {
                input.fire();
                input.lastFiredAtTime = performance.now();
                handleHeldGamepadInput(input)
            }
            if (!input.isSingleTriggerAction && !input.pressed) {
                handleInitialGamepadInput(input)
            }
            if (input.isSingleTriggerAction) {
                handleSingleTriggerGamepadInput(input)
            }
        }
    });
    requestAnimationFrame(() => handleHeldDownKeys());

    function handleHeldGamepadInput(input: Input): void {
        if (canUseGamepad && input.controllerButtonIndex !== undefined) {
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i]?.buttons[input.controllerButtonIndex]?.pressed) {
                    input.fire();
                    input.lastFiredAtTime = performance.now();
                } else {
                    input.pressed = false;
                }
            }
        }
    }

    function handleInitialGamepadInput(input: Input): void {
        if (canUseGamepad && input.controllerButtonIndex !== undefined) {
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i]?.buttons[input.controllerButtonIndex]?.pressed) {
                    input.lastFiredAtTime = performance.now();
                    input.fire();
                    input.pressed = true;
                }
            }
        }
    }

    function handleSingleTriggerGamepadInput(input: Input): void {
        if (canUseGamepad && input.controllerButtonIndex !== undefined) {
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i]?.buttons[input.controllerButtonIndex]?.pressed) {
                    if (!input.pressed) {
                        input.fire();
                        input.lastFiredAtTime = performance.now();
                    }
                    input.pressed = true;
                } else {
                    input.pressed = false;
                }
            }
        }
    }
}
