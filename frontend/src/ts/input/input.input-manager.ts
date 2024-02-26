import { angleCenter, angleLeft, angleRight, changeAPS, revertAPS, triggerHold, triggerShoot } from "../game/game.master";
import { angleLeftInput, angleRightInput, centerCursorInput, changeAPSInput, holdInput, shootInput } from "./input.possible-inputs";

export function enableGameInputs(): void {
    angleLeftInput.fire = angleLeft;
    angleRightInput.fire = angleRight;
    centerCursorInput.fire = angleCenter;
    changeAPSInput.fire = changeAPS;
    changeAPSInput.release = revertAPS;
    shootInput.fire = triggerShoot;
    holdInput.fire = triggerHold;

    angleLeftInput.enabled = true;
    angleRightInput.enabled = true;
    centerCursorInput.enabled = true;
    changeAPSInput.enabled = true;
    shootInput.enabled = true;
    holdInput.enabled = true;
}

export function disableGameInputs(): void {
    angleLeftInput.enabled = false;
    angleRightInput.enabled = false;
    centerCursorInput.enabled = false;
    changeAPSInput.enabled = false;
    shootInput.enabled = false;
    holdInput.enabled = false;
    
    angleLeftInput.pressed = false;
    angleRightInput.pressed = false;
    centerCursorInput.pressed = false;
    changeAPSInput.pressed = false;
    shootInput.pressed = false;
    holdInput.pressed = false;
}
