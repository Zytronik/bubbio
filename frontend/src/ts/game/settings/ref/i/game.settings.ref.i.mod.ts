import { Ref } from "vue";

export interface ToggleMod{
    abr: string;
    title: string;
    enabled: Ref<boolean>;
    icon: string;
}

export interface MultiMod{
    abr: string[];
    title: string;
    selected: Ref<number>;
    modValues: number[];
    icon: string[];
}