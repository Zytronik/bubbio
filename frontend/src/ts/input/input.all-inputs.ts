import { Input } from "./i/input.i.input";

export const angleLeftInput: Input = {
    name: "Angle Left",
    description: "Move the angle of the cannon to the left",
    customKeyMap: ["ArrowLeft", "", ""],
    defaultKeyCode: "ArrowLeft",
    controllerAxisDirection: [0, -1],
    isSingleTriggerAction: false,
    pressed: false,
    controllerPressed: false,
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
    customKeyMap: ["ArrowRight", "", ""],
    defaultKeyCode: "ArrowRight",
    controllerAxisDirection: [0, 1],
    isSingleTriggerAction: false,
    pressed: false,
    controllerPressed: false,
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
    customKeyMap: ["ShiftLeft", "", ""],
    defaultKeyCode: "ShiftLeft",
    controllerButtonIndex: 2,
    isSingleTriggerAction: true,
    pressed: false,
    controllerPressed: false,
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
    name: "Set angle to 90°",
    description: "Set the angle of the cannon to 90°",
    customKeyMap: ["ArrowUp", "", ""],
    defaultKeyCode: "ArrowUp",
    controllerAxisDirection: [1, -1],
    isSingleTriggerAction: true,
    pressed: false,
    controllerPressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + shootInput.name);
    },
    enabled: false,
};

export const mirrorCursorInput: Input = {
    name: "Mirror current Angle",
    description: "Mirror the angle to the other side.",
    customKeyMap: ["ArrowDown", "", ""],
    defaultKeyCode: "ArrowDown",
    controllerAxisDirection: [1, 1],
    isSingleTriggerAction: true,
    pressed: false,
    controllerPressed: false,
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
    customKeyMap: ["Space", "", ""],
    defaultKeyCode: "Space",
    controllerButtonIndex: 0,
    isSingleTriggerAction: true,
    pressed: false,
    controllerPressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + shootInput.name);
    },
    enabled: false,
};

export const holdInput: Input = {
    name: "Switch Bubble",
    description: "Switch a bubble",
    customKeyMap: ["ControlLeft", "", ""],
    defaultKeyCode: "ControlLeft",
    controllerButtonIndex: 4,
    isSingleTriggerAction: true,
    pressed: false,
    controllerPressed: false,
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
    customKeyMap: ["KeyR", "", ""],
    defaultKeyCode: "KeyR",
    controllerButtonIndex: 7,
    isSingleTriggerAction: true,
    pressed: false,
    controllerPressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + resetInput.name);
    },
    enabled: false,
};

export const backInput: Input = {
    name: "Back",
    description: "Go back one menu",
    customKeyMap: ["Escape", "", ""],
    defaultKeyCode: "Escape",
    controllerButtonIndex: 9,
    isSingleTriggerAction: true,
    pressed: false,
    controllerPressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + backInput.name);
    },
    enabled: false,
};

export const channelInput: Input = {
    name: "Open Channel",
    description: "Open the channel",
    customKeyMap: ["F9", "", ""],
    defaultKeyCode: "F9",
    isSingleTriggerAction: true,
    pressed: false,
    controllerPressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: () => {
        console.error("no fire event attached to keyCode: " + channelInput.name);
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
    backInput,
    channelInput,
    mirrorCursorInput,
]

const allKeyCodes = [
    // Alphanumeric keys
    "KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK", "KeyL",
    "KeyM", "KeyN", "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyX",
    "KeyY", "KeyZ",
    
    // Numerical keys
    "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9",
    
    // Function keys
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
    
    // Arrow keys
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    
    // Special keys
    "Backspace", "Tab", "Enter", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight",
    "AltLeft", "AltRight", "Pause", "CapsLock", "Escape", "Space", "PageUp", "PageDown", "End", "Home",
    "Insert", "Delete", "PrintScreen", "ContextMenu", 
    
    // Numpad keys
    "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7",
    "Numpad8", "Numpad9", "NumpadAdd", "NumpadSubtract", "NumpadMultiply", "NumpadDivide",
    "NumpadDecimal", "NumpadEnter",
    
    // Media keys
    "MediaPlayPause", "MediaStop", "MediaTrackPrevious", "MediaTrackNext", "VolumeUp", "VolumeDown",
    "VolumeMute", "LaunchMail", "LaunchApp1", "LaunchApp2",
    
    // Browser keys
    "BrowserBack", "BrowserForward", "BrowserRefresh", "BrowserStop", "BrowserSearch", "BrowserFavorites",
    "BrowserHome",
    
    // Other keys
    "IntlBackslash", "IntlRo", "IntlYen", "IntlHash", "IntlPipe", "IntlBackquote", "AudioVolumeUp",
    "AudioVolumeDown", "AudioVolumeMute", "LaunchMail", "LaunchApp1", "LaunchApp2", "ProcessKey",
    "Convert", "NonConvert", "Lang1", "Lang2", "Lang3", "Lang4", "Lang5",
    
    // Additional keys
    "MetaLeft", "MetaRight", "ContextMenu",
    
    // Miscellaneous keys
    "ContextMenu", "NumpadDecimal", "NumpadEnter", "NumpadAdd", "NumpadSubtract", "NumpadMultiply",
    "NumpadDivide", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24",
    "NumLock", "ScrollLock", "AudioVolumeMute", "AudioVolumeDown", "AudioVolumeUp", "LaunchMediaPlayer",
    "LaunchApplication1", "LaunchApplication2", "Semicolon", "Equal", "Comma", "Minus", "Period",
    "Slash", "Backquote", "BracketLeft", "Backslash", "BracketRight", "Quote"
]; 
export const defaultBlocker: Input = {
    name: "PreventDefault",
    description: "hehe you cant do this",
    customKeyMap: allKeyCodes,
    defaultKeyCode: "",
    isSingleTriggerAction: true,
    pressed: false,
    controllerPressed: false,
    lastFiredAtTime: 0,
    releasedAtTime: 0,
    fire: /* eslint-disable @typescript-eslint/no-empty-function */ () => { /* eslint-enable @typescript-eslint/no-empty-function */ },
    enabled: false,
}