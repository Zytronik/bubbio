import { Input } from "./input.i-input";

export const angleLeftInput: Input = {
    name: "Angle Left",
    description: "Move the angle of the cannon to the left",
    customKeyMap: {map: ["","",""]},
    defaultKeyCode: "ArrowLeft",
    isTrigger: false,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + angleLeftInput.name);
    },
    enabled: false,
};

export const angleRightInput: Input = {
    name: "Angle Right",
    description: "Move the angle of the cannon to the right",
    customKeyMap: {map: ["","",""]},
    defaultKeyCode: "ArrowRight",
    isTrigger: false,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + angleRightInput.name);
    },
    enabled: false,
};

export const changeAPSInput: Input = {
    name: "Change APS",
    description: "Change the angle per second of the cannon",
    customKeyMap: {map: ["","",""]},
    defaultKeyCode: "ShiftLeft",
    isTrigger: false,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + changeAPSInput.name);
    },
    release: () => {
        console.error("no release event attached to keyCode: " + changeAPSInput.name);
    },
    enabled: false,
};

export const centerCursorInput: Input = {
    name: "Set Cursor to 90°",
    description: "Set the angle of the cannon to 90°",
    customKeyMap: {map: ["","",""]},
    defaultKeyCode: "ArrowUp",
    isTrigger: true,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + shootInput.name);
    },
    enabled: false,
};

export const shootInput: Input = {
    name: "Shoot",
    description: "Shoot a bubble",
    customKeyMap: {map: ["","",""]},
    defaultKeyCode: "Space",
    isTrigger: true,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + shootInput.name);
    },
    enabled: false,
};

export const holdInput: Input = {
    name: "Hold Bubble",
    description: "Hold a bubble",
    customKeyMap: {map: ["","",""]},
    defaultKeyCode: "ControlLeft",
    isTrigger: true,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + holdInput.name);
    },
    enabled: false,
};

export const resetInput: Input = {
    name: "Restart Game",
    description: "Restart the game",
    customKeyMap: {map: ["","",""]},
    defaultKeyCode: "KeyR",
    isTrigger: true,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + resetInput.name);
    },
    enabled: false,
};

export const debugTriggerGarbageInput: Input = {
    name: "Trigger Garbage",
    description: "Adds Garbage to the grid",
    customKeyMap: {map: ["","",""]},
    defaultKeyCode: "KeyU",
    isTrigger: true,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + debugTriggerGarbageInput.name);
    },
    enabled: false,
};

export const allInputs: Input[] = [
    angleLeftInput, 
    angleRightInput, 
    changeAPSInput, 
    centerCursorInput, 
    shootInput,
    holdInput,
    resetInput,
    debugTriggerGarbageInput,
]