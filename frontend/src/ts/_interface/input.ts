import { INPUT_CONTEXT } from "../_constant/inputContext";

export interface Input {
    name: string;
    description: string;
    customKeyMap: string[];
    defaultKeyCode: string;
    isSingleTriggerAction: boolean;
    pressed: boolean;
    lastFiredAtTime: number;
    releasedAtTime: number;
    fire: () => void;
    release?: () => void;
    inputContext: INPUT_CONTEXT[];
}