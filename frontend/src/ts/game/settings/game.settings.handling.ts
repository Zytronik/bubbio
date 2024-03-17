import { NumberSetting } from "./i/game.settings.i.number-setting"
import { HandlingSettings } from "./i/game.settings.i.handling-settings"

const defaultAPS: NumberSetting = {
    name: "Default APS",
    description: "Angle/Second - How fast the arrow moves",
    value: 60,
    refValue: 60,
    defaultValue: 60,
    min: 1,
    max: 1,
}

const toggleAPS: NumberSetting = {
    name: "Toggle APS",
    description: "Alternate Angle/Second - How fast the arrow moves while pressing the {} button",
    value: 10,
    refValue: 10,
    defaultValue: 10,
    min: 1,
    max: 1,
}

export const allHandlingSettings: HandlingSettings = {
    defaultAPS: defaultAPS,
    toggleAPS: toggleAPS,
}