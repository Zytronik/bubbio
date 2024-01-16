import { NumberSetting } from "./game-settings.i-number-setting";

export const APS: NumberSetting = {
    name: "APS",
    description: "Angle/Second - How fast the arrow moves",
    value: 30,
    defaultValue: 30,
    min: 1,
    max: 1,
}