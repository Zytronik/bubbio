import { NumberSetting } from "./i/settings.i.number-setting"

export const APS: NumberSetting = {
    name: "APS",
    description: "Angle/Second - How fast the arrow moves",
    value: 60,
    defaultValue: 60,
    min: 1,
    max: 1,
}

export const APS2: NumberSetting = {
    name: "APS2",
    description: "Alternate Angle/Second - How fast the arrow moves while pressing the {} button",
    value: 10,
    defaultValue: 10,
    min: 1,
    max: 1,
}