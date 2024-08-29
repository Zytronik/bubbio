import { Input } from "../_interface/input.i.input";
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
            if (!input.isSingleTriggerAction && (input.pressed || input.controllerPressed)) {
                input.fire();
                input.lastFiredAtTime = performance.now();
                handleHeldGamepadInput(input);
            }
            if (!input.isSingleTriggerAction && !input.controllerPressed) {
                handleInitialGamepadInput(input);
            }
            if (input.isSingleTriggerAction) {
                handleSingleTriggerGamepadInput(input);
            }
        }
    });
    requestAnimationFrame(() => handleHeldDownKeys());

    function handleHeldGamepadInput(input: Input): void {
        if (canUseGamepad) {
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                if (input.controllerButtonIndex !== undefined) {
                    if (gamepads[i]?.buttons[input.controllerButtonIndex]?.pressed) {
                        input.fire();
                        input.lastFiredAtTime = performance.now();
                    } else {
                        input.controllerPressed = false;
                    }
                }
                if (input.controllerAxisDirection !== undefined) {
                    const axis = input.controllerAxisDirection[0];
                    const direction = input.controllerAxisDirection[1];
                    if (gamepads[i]?.axes[axis] === direction) {
                        input.fire();
                        input.lastFiredAtTime = performance.now();
                    } else {
                        input.controllerPressed = false;
                    }
                }
            }
        }
    }

    function handleInitialGamepadInput(input: Input): void {
        if (canUseGamepad) {
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                if (input.controllerButtonIndex !== undefined) {
                    if (gamepads[i]?.buttons[input.controllerButtonIndex]?.pressed) {
                        input.lastFiredAtTime = performance.now();
                        input.fire();
                        input.controllerPressed = true;
                    }
                }
                if (input.controllerAxisDirection !== undefined) {
                    const axis = input.controllerAxisDirection[0];
                    const direction = input.controllerAxisDirection[1];
                    if (gamepads[i]?.axes[axis] === direction) {
                        input.lastFiredAtTime = performance.now();
                        input.fire();
                        input.controllerPressed = true;
                    }
                }
            }
        }
    }

    function handleSingleTriggerGamepadInput(input: Input): void {
        if (canUseGamepad) {
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                if (input.controllerButtonIndex !== undefined) {
                    if (gamepads[i]?.buttons[input.controllerButtonIndex]?.pressed) {
                        if (!input.controllerPressed) {
                            input.fire();
                            input.lastFiredAtTime = performance.now();
                        }
                        input.controllerPressed = true;
                    } else {
                        if(input.controllerPressed && input.release) {
                            input.release();
                        }
                        input.controllerPressed = false;
                    }
                }
                if (input.controllerAxisDirection !== undefined) {
                    const axis = input.controllerAxisDirection[0];
                    const direction = input.controllerAxisDirection[1];
                    if (gamepads[i]?.axes[axis] === direction) {
                        if (!input.controllerPressed) {
                            input.fire();
                            input.lastFiredAtTime = performance.now();
                        }
                        input.controllerPressed = true;
                    } else {
                        input.controllerPressed = false;
                    }
                }
            }
        }
    }
}
