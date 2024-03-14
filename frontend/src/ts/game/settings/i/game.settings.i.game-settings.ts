import { BooleanSetting } from "./game.settings.i.boolean-setting";
import { NumberSetting } from "./game.settings.i.number-setting";

export interface GameSettings {
    gridWidth: NumberSetting,
    gridHeight: NumberSetting,
    gridExtraHeight: NumberSetting,

    minAngle: NumberSetting,
    maxAngle: NumberSetting,

    widthPrecisionUnits: NumberSetting,
    collisionDetectionFactor: NumberSetting,

    dissolveFloatingBubbles: BooleanSetting,

    queuePreviewSize: NumberSetting,
    bubbleBagSize: NumberSetting,

    garbageMaxAtOnce: NumberSetting,
    garbageCleanAmount: NumberSetting,
    garbageColorAmount: NumberSetting,

    sprintClearAmount: NumberSetting,

    //passtrough
    //combotable
    //bagsize
    //rngsettings
    //garbagesettings
        //after how many fired bubbles garbage spawns

    //gravity? time to shoot
}