export interface Input {
    name: string;
    description: string;
    customKeyMap: string[];
    defaultKeyCode: string;
    controllerButtonIndex?: number;
    isSingleTriggerAction: boolean;
    pressed: boolean;
    lastFiredAtTime: number;
    releasedAtTime: number;
    fire: () => void;
    release?: () => void;
    enabled: boolean;
}