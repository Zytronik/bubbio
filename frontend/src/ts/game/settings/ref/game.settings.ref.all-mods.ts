import { ref } from "vue";
import { MultiMod, ToggleMod } from "./i/game.settings.ref.i.mod";

export const digMod: ToggleMod = {
    abr: "D",
    title: "Dig",
    enabled: ref(false),
    icon: "",
}

export const precisionMod: ToggleMod = {
    abr: "P",
    title: "Precision",
    enabled: ref(false),
    icon: "",
}
 
export const randomnessMod: MultiMod = {
    abr: ["Random", "7-Bag", "10-Bag", "21-Bag"],
    title: "Bubble Randomness",
    selected: ref(7),
    modValues: [1, 7, 10, 21],
    icon: [""],
}

export const allMods: ToggleMod[] = [
    digMod,
    precisionMod,
];