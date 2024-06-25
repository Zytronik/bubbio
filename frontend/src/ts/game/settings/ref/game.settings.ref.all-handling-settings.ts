import { NumberSetting } from "./i/game.settings.ref.i.number-setting"
import { ref } from "vue"

export const DEFAULT_APS: NumberSetting = {
    name: "Angle/Second",
    description: "Angle/Second - How fast the arrow moves",
    refNumber: ref(60),
    defaultValue: 60,
    min: 10,
    max: 500,
}
export const TOGGLE_APS: NumberSetting = {
    name: "Precise Angle/Second",
    description: "Alternate Angle/Second - How fast the arrow moves while pressing the toggle button",
    refNumber: ref(10),
    defaultValue: 10,
    min: 3,
    max: 500,
}