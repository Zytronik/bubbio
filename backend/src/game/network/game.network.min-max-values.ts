import { MinMaxSetting } from "./i/game.network.i.min-max-setting"
import { GameSettingsMinMaxValues } from "./i/game.network.i.min-max-values"

const GRID_WIDTH: MinMaxSetting = {
    min: 4,
    max: 15,
}
const GRID_HEIGHT: MinMaxSetting = {
    min: 3,
    max: 30,
}
const GRID_EXTRA_HEIGHT: MinMaxSetting = {
    min: 1,
    max: 5,
}
const MIN_ANGLE: MinMaxSetting = {
    min: 0.1,
    max: 89.9,
}
const MAX_ANGLE: MinMaxSetting = {
    min: 90.1,
    max: 179.9,
}
const WIDTH_PRECISION_UNITS: MinMaxSetting = {
    min: 1000000,
    max: 100000000,
}
const COLLISION_DETECTION_FACTOR: MinMaxSetting = {
    min: 0.3,
    max: 1,
}
const QUEUE_PREVIEW_SIZE: MinMaxSetting = {
    min: 0,
    max: 10,
}
const SPRINT_CLEAR_AMOUNT: MinMaxSetting = {
    min: 20,
    max: 1000,
}
export const gameSettingsMinMaxValues: GameSettingsMinMaxValues = {
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    gridExtraHeight: GRID_EXTRA_HEIGHT,
    minAngle: MIN_ANGLE,
    maxAngle: MAX_ANGLE,
    widthPrecisionUnits: WIDTH_PRECISION_UNITS,
    collisionDetectionFactor: COLLISION_DETECTION_FACTOR,
    queuePreviewSize: QUEUE_PREVIEW_SIZE,
    sprintClearAmount: SPRINT_CLEAR_AMOUNT,
}
