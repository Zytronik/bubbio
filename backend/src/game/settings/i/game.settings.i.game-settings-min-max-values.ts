import { MinMaxSetting } from "./game.settings.i.min-max-setting";

export interface GameSettingsMinMaxValues {
    gridWidth: MinMaxSetting,
    gridHeight: MinMaxSetting,
    gridExtraHeight: MinMaxSetting,
    minAngle: MinMaxSetting,
    maxAngle: MinMaxSetting,
    widthPrecisionUnits: MinMaxSetting,
    collisionDetectionFactor: MinMaxSetting,
    queuePreviewSize: MinMaxSetting,
    sprintClearAmount: MinMaxSetting,
}