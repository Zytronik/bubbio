import { BooleanSetting } from "@/ts/settings/i/settings.i.boolean-setting";
import { NumberSetting } from "@/ts/settings/i/settings.i.number-setting";

export interface GameSettings {
    gridWidth: NumberSetting,
    gridHeight: NumberSetting,
    gridExtraHeight: NumberSetting,

    minAngle: NumberSetting,
    maxAngle: NumberSetting,

    widthPrecisionUnits: NumberSetting,
    collisionDetectionFactor: NumberSetting,

    dissolveFloatingBubbles: BooleanSetting,

    canUseHold: BooleanSetting,
    queuePreviewSize: NumberSetting,

    //passtrough
    //combotable
    //bagsize
    //rngsettings
    //garbagesettings
        //after how many fired bubbles garbage spawns

    //gravity
}