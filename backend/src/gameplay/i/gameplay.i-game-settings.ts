import { BooleanSetting } from "./gameplay.i-boolean-setting";
import { NumberSetting } from "./gameplay.i-number-setting";

export interface GameSettings {
    gridWidth: NumberSetting,
    gridHeight: NumberSetting,
    gridExtraHeight: NumberSetting,
    minAngle: NumberSetting,
    maxAngle: NumberSetting,
    widthPrecisionUnits: NumberSetting,
    collisionDetectionFactor: NumberSetting,
    dissolveFloatingBubbles: BooleanSetting

    //passtrough
    //combotable
    //bagsize
    //rngsettings
    //garbagesettings
        //after how many fired bubbles garbage spawns
}