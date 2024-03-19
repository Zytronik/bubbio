import { ref } from "vue"
import { BooleanSetting } from "./i/game.settings.i.boolean-setting"
import { NumberSetting } from "./i/game.settings.i.number-setting"

export const GRID_WIDTH: NumberSetting = {
    name: "Grid Width",
    description: "How many bubbles fit in a row.",
    refNumber: ref(8),
    defaultValue: 8,
    min: 5,
    max: 15,
}
export const GRID_HEIGHT: NumberSetting = {
    name: "Grid Height",
    description: "How many bubbles fit in a column.",
    refNumber: ref(15),
    defaultValue: 15,
    min: 3,
    max: 30,
}
export const GRID_EXTRA_HEIGHT: NumberSetting = {
    name: "Extra Grid Height",
    description: "Space between the board and the Bubble-Launcher.",
    refNumber: ref(3),
    defaultValue: 3,
    min: 1,
    max: 5,
}
export const MIN_ANGLE: NumberSetting = {
    name: "Min Angle",
    description: "Minimum angle the player can shoot at.",
    refNumber: ref(12),
    defaultValue: 12,
    min: 0.1,
    max: 89.9,
}
export const MAX_ANGLE: NumberSetting = {
    name: "Max Angle",
    description: "Maximum angle the player can shoot at.",
    refNumber: ref(168),
    defaultValue: 168,
    min: 90.1,
    max: 179.9,
}
export const WIDTH_PRECISION_UNITS: NumberSetting = {
    name: "Total Precision Units",
    description: "Dictates how precise the width of the grid is. Higher values mean more precision but also more calculations.",
    refNumber: ref(10000000),
    defaultValue: 10000000,
    min: 1000000,
    max: 100000000,
}
export const COLLISION_DETECTION_FACTOR: NumberSetting = {
    name: "Collision Detection Sizefactor",
    description: "Sizefactor of Bubbles for the collision detection.",
    refNumber: ref(0.3),
    defaultValue: 0.3,
    min: 0.3,
    max: 1,
}
export const DISSOLVE_FLOATING_BUBBLES: BooleanSetting = {
    name: "Dissolve Floating Bubbles",
    description: "If floating bubbles should dissolve.",
    refBoolean: ref(true),
    defaultValue: true,
}
export const PREFILL_BOARD: BooleanSetting = {
    name: "Prefill Board",
    description: "If the board already has bubbles on it.",
    refBoolean: ref(false),
    defaultValue: false,
}
export const REFILL_BOARD: BooleanSetting = {
    name: "Refill board",
    description: "Wether or not the board should be refilled upon reaching a certain height.",
    refBoolean: ref(false),
    defaultValue: false,
}
export const REFILL_AMOUNT: NumberSetting = {
    name: "Amount of lines on refill",
    description: "How many lines should be refilled upon reaching a certain height.",
    refNumber: ref(3),
    defaultValue: 3,
    min: 0,
    max: 5,
}
export const QUEUE_PREVIEW_SIZE: NumberSetting = {
    name: "Queue Preview Size",
    description: "How many bubbles are shown in the queue preview.",
    refNumber: ref(5),
    defaultValue: 5,
    min: 0,
    max: 10,
}
export const BUBBLE_BAG_SIZE: NumberSetting = {
    name: "Bubble Bag Size",
    description: "How many unique bubbles are put in a bag-system, before they repeat.",
    refNumber: ref(7),
    defaultValue: 7,
    min: 1,
    max: 14,
}
export const GARBAGE_MAX_AT_ONCE: NumberSetting = {
    name: "Max garbage at once",
    description: "Maximum amount of garbage to be received at once.",
    refNumber: ref(3),
    defaultValue: 3,
    min: 1,
    max: 4,
}
export const GARBAGE_CLEAN_AMOUNT: NumberSetting = {
    name: "Clean Garbage Amount",
    description: "How many of the same bubbles should be guaranteed to be adjacent in a garbage row.",
    refNumber: ref(3),
    defaultValue: 3,
    min: 1,
    max: 4,
}
export const GARBAGE_COLOR_AMOUNT: NumberSetting = {
    name: "Garbage Color Amount",
    description: "How many different colors garbage can have.",
    refNumber: ref(3),
    defaultValue: 3,
    min: 2,
    max: 7,
}