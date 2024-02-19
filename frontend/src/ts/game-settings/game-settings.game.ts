import { NumberSetting } from "./game-settings.i-number-setting";

export const GRID_WIDTH: NumberSetting = {
    name: "Grid Width",
    description: "How many bubbles fit in a row.",
    value: 8,
    defaultValue: 8,
    min: 4,
    max: 15,
}

export const GRID_HEIGHT: NumberSetting = {
    name: "APS2",
    description: "How many bubbles fit in a column.",
    value: 15,
    defaultValue: 15,
    min: 3,
    max: 30,
}

export const GRID_EXTRA_HEIGHT: NumberSetting = {
    name: "APS2",
    description: "Space between the board and the Bubble-Launcher",
    value: 3,
    defaultValue: 3,
    min: 1,
    max: 5,
}