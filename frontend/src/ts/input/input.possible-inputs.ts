import { Input } from "./input.i-input";

export const leftInput: Input = {
    name: "Left",
    defaultKeyCode: "ArrowLeft",
    isTrigger: false,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + leftInput.name);
    }
};

export const rightInput: Input = {
    name: "Right",
    defaultKeyCode: "ArrowRight",
    isTrigger: false,
    pressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + rightInput.name);
    }
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
    }
};

export const allInputs: Input[] = [leftInput, rightInput, shootInput]
