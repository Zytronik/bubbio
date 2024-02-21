import { BooleanSetting } from "./i/settings.i.boolean-setting"
import { NumberSetting } from "./i/settings.i.number-setting"

export const GRID_WIDTH: NumberSetting = {
    name: "Grid Width",
    description: "How many bubbles fit in a row.",
    value: 8,
    defaultValue: 8,
    min: 4,
    max: 15,
}
export const GRID_HEIGHT: NumberSetting = {
    name: "Grid Height",
    description: "How many bubbles fit in a column.",
    value: 15,
    defaultValue: 15,
    min: 3,
    max: 30,
}
export const GRID_EXTRA_HEIGHT: NumberSetting = {
    name: "Extra Grid Height",
    description: "Space between the board and the Bubble-Launcher.",
    value: 3,
    defaultValue: 3,
    min: 1,
    max: 5,
}
export const MIN_ANGLE: NumberSetting = {
    name: "Min Angle",
    description: "Minimum angle the player can shoot at.",
    value: 12,
    defaultValue: 12,
    min: 0.1,
    max: 89.9,
}
export const MAX_ANGLE: NumberSetting = {
    name: "Max Angle",
    description: "Maximum angle the player can shoot at.",
    value: 168,
    defaultValue: 168,
    min: 90.1,
    max: 179.9,
}
export const WIDTH_PRECISION_UNITS: NumberSetting = {
    name: "Total Precision Units",
    description: "Dictates how precise the width of the grid is. Higher values mean more precision but also more calculations.",
    value: 10000000,
    defaultValue: 10000000,
    min: 1000000,
    max: 100000000,
}
export const COLLISION_DETECTION_FACTOR: NumberSetting = {
    name: "Collision Detection Sizefactor",
    description: "Sizefactor of Bubbles for the collision detection.",
    value: 0.3,
    defaultValue: 0.3,
    min: 0.3,
    max: 1,
}
export const DISSOLVE_FLOATING_BUBBLES: BooleanSetting = {
    name: "Dissolve Floating Bubbles",
    description: "If floating bubbles should dissolve.",
    value: true,
    defaultValue: true,
}
export const CAN_USE_HOLD: BooleanSetting = {
    name: "Can Use Hold",
    description: "If the player can use the hold feature.",
    value: true,
    defaultValue: true,
}
export const QUEUE_PREVIEW_SIZE: NumberSetting = {
    name: "Queue Preview Size",
    description: "How many bubbles are shown in the queue preview.",
    value: 5,
    defaultValue: 5,
    min: 0,
    max: 10,
}