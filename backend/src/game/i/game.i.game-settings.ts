import { BooleanSetting } from "./game.i.boolean-setting";
import { NumberSetting } from "./game.i.number-setting";

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
}