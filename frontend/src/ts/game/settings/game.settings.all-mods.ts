import { ref } from "vue";
import { Mod } from "./i/game.settings.i.mod";

export const digMod: Mod = {
    abr: "D",
    title: "Dig",
    enabled: ref(false),
    icon: "",
}

export const precisionMod: Mod = {
    abr: "P",
    title: "Precision",
    enabled: ref(false),
    icon: "",
}

export const allMods: Mod[] = [
    digMod,
    precisionMod,
];