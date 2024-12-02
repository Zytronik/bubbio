import { INPUT_CONTEXT } from "../_enum/inputContext";

export interface Input {
    name: string;
    description: string;
    customKeyMap: string[];
    defaultKeyCode: string;
    isSingleTriggerAction: boolean;
    pressed: boolean;
    fire: () => void;
    release?: () => void;
    inputContext: INPUT_CONTEXT[];
}