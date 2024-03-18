import { Ref } from "vue";

export interface Mod{
    abr: string;
    title: string;
    enabled: Ref<boolean>;
    icon: string;
}