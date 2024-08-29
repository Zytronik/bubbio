import { MultiMod, ToggleMod } from "../_interface/game.settings.ref.i.mod";

export const digMod: ToggleMod = {
    abr: "D",
    title: "Dig",
    enabled: false,
    icon: ["d1.png", "d2.png"],
}

export const precisionMod: ToggleMod = {
    abr: "G",
    title: "Gravity",
    enabled: false,
    icon: ["p1.png", "p2.png"],
}

export const randomnessMod: MultiMod = {
    abr: ["Random", "7-Bag", "10-Bag", "21-Bag"],
    title: "Bag Size",
    selected: 7,
    modValues: [1, 7, 10, 21],
    icon: ["r1.png", "r7.png", "r10.png", "r21.png",],
}

export const allMods: (ToggleMod | MultiMod)[] = [
    digMod,
    precisionMod,
    randomnessMod,
];