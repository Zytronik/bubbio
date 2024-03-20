export interface Mod {
    title: string;
}

export interface ToggleMod extends Mod{
    abr: string;
    enabled: boolean;
    icon: string[];
}

export interface MultiMod extends Mod{
    abr: string[];
    selected: number;
    modValues: number[];
    icon: string[];
}