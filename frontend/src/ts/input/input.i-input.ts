import { CustomKeyMap } from "./input.i-custom-keymap";

export interface Input {
    name: string;
    description: string;
    customKeyMap: CustomKeyMap;
    defaultKeyCode: string;
    isTrigger: boolean;
    pressed: boolean;
    lastFiredAtTime: number;
    releasedAtTime: number;
    fire: () => void;
    release?: () => void;
    enabled: boolean;
}