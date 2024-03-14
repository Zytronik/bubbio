import { BooleanSetting } from "./i/game.settings.i.boolean-setting"
import { NumberSetting } from "./i/game.settings.i.number-setting"
import { GameSettings } from "./i/game.settings.i.game-settings"

const GRID_WIDTH: NumberSetting = {
    name: "Grid Width",
    description: "How many bubbles fit in a row.",
    value: 8,
    refValue: 8,
    defaultValue: 8,
    min: 5,
    max: 15,
}
const GRID_HEIGHT: NumberSetting = {
    name: "Grid Height",
    description: "How many bubbles fit in a column.",
    value: 15,
    refValue: 15,
    defaultValue: 15,
    min: 3,
    max: 30,
}
const GRID_EXTRA_HEIGHT: NumberSetting = {
    name: "Extra Grid Height",
    description: "Space between the board and the Bubble-Launcher.",
    value: 3,
    refValue: 3,
    defaultValue: 3,
    min: 1,
    max: 5,
}
const MIN_ANGLE: NumberSetting = {
    name: "Min Angle",
    description: "Minimum angle the player can shoot at.",
    value: 12,
    refValue: 12,
    defaultValue: 12,
    min: 0.1,
    max: 89.9,
}
const MAX_ANGLE: NumberSetting = {
    name: "Max Angle",
    description: "Maximum angle the player can shoot at.",
    value: 168,
    refValue: 168,
    defaultValue: 168,
    min: 90.1,
    max: 179.9,
}
const WIDTH_PRECISION_UNITS: NumberSetting = {
    name: "Total Precision Units",
    description: "Dictates how precise the width of the grid is. Higher values mean more precision but also more calculations.",
    value: 10000000,
    refValue: 10000000,
    defaultValue: 10000000,
    min: 1000000,
    max: 100000000,
}
const COLLISION_DETECTION_FACTOR: NumberSetting = {
    name: "Collision Detection Sizefactor",
    description: "Sizefactor of Bubbles for the collision detection.",
    value: 0.3,
    refValue: 0.3,
    defaultValue: 0.3,
    min: 0.3,
    max: 1,
}
const DISSOLVE_FLOATING_BUBBLES: BooleanSetting = {
    name: "Dissolve Floating Bubbles",
    description: "If floating bubbles should dissolve.",
    value: true,
    refValue: true,
    defaultValue: true,
}
const QUEUE_PREVIEW_SIZE: NumberSetting = {
    name: "Queue Preview Size",
    description: "How many bubbles are shown in the queue preview.",
    value: 5,
    refValue: 5,
    defaultValue: 5,
    min: 0,
    max: 10,
}
const BUBBLE_BAG_SIZE: NumberSetting = {
    name: "Bubble Bag Size",
    description: "How many unique bubbles are put in a bag-system, before they repeat.",
    value: 7,
    refValue: 7,
    defaultValue: 7,
    min: 1,
    max: 14,
}
const MAX_GARBAGE_AT_ONCE: NumberSetting = {
    name: "Max garbage at once",
    description: "Maximum amount of garbage to be received at once.",
    value: 3,
    refValue: 3,
    defaultValue: 3,
    min: 1,
    max: 4,
}
const CLEAN_GARBAGE_AMOUNT: NumberSetting = {
    name: "Clean Garbage Amount",
    description: "How many of the same bubbles should be guaranteed to be adjacent in a garbage row.",
    value: 3,
    refValue: 3,
    defaultValue: 3,
    min: 1,
    max: 4,
}
const GARBAGE_COLOR_AMOUNT: NumberSetting = {
    name: "Garbage Color Amount",
    description: "How many different colors garbage can have.",
    value: 3,
    refValue: 3,
    defaultValue: 3,
    min: 2,
    max: 7,
}
const SPRINT_CLEAR_AMOUNT: NumberSetting = {
    name: "Sprint Clear Amount",
    description: "How many bubbles it takes to win a sprint.",
    value: 100,
    refValue: 100,
    defaultValue: 100,
    min: 20,
    max: 1000,
}
export const allGameSettings: GameSettings = {
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    gridExtraHeight: GRID_EXTRA_HEIGHT,
    minAngle: MIN_ANGLE,
    maxAngle: MAX_ANGLE,
    widthPrecisionUnits: WIDTH_PRECISION_UNITS,
    collisionDetectionFactor: COLLISION_DETECTION_FACTOR,
    dissolveFloatingBubbles: DISSOLVE_FLOATING_BUBBLES,
    queuePreviewSize: QUEUE_PREVIEW_SIZE,
    bubbleBagSize: BUBBLE_BAG_SIZE,
    garbageMaxAtOnce: MAX_GARBAGE_AT_ONCE,
    garbageCleanAmount: CLEAN_GARBAGE_AMOUNT,
    garbageColorAmount: GARBAGE_COLOR_AMOUNT,
    sprintClearAmount: SPRINT_CLEAR_AMOUNT,
}