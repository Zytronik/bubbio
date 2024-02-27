import { Input } from "./input.i-input";

export const angleLeftInput: Input = {
    name: "Angle Left",
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
    defaultKeyCode: "KeyR",
    isTrigger: true,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + holdInput.name);
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
]
