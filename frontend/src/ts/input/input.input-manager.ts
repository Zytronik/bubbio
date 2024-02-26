import { angleCenter, angleLeft, angleRight, changeAPS, revertAPS, triggerShoot } from "../game/game.master";
import { angleLeftInput, angleRightInput, centerCursorInput, changeAPSInput, shootInput } from "./input.possible-inputs";

export function enableGameInputs(): void {
    setupAngleControls();
    setupShootControls();
    enableAngleControls();
    enableShootControls();

    function setupAngleControls(): void {
        angleLeftInput.fire = angleLeft;
        angleRightInput.fire = angleRight;
        centerCursorInput.fire = angleCenter;
        changeAPSInput.fire = changeAPS;
        changeAPSInput.release = revertAPS;
    }

    function setupShootControls(): void {
        shootInput.fire = triggerShoot;
    }

    function enableAngleControls(): void {
        angleLeftInput.enabled = true;
        angleRightInput.enabled = true;
        centerCursorInput.enabled = true;
        changeAPSInput.enabled = true;
    }

    function enableShootControls(): void {
        shootInput.enabled = true;
    }
}

export function disableGameInputs(): void {
    disableAngleControls();
    disableShootControls();

    function disableAngleControls(): void {
        angleLeftInput.enabled = false;
        angleLeftInput.pressed = false;
        angleRightInput.enabled = false;
        angleRightInput.pressed = false;
        centerCursorInput.enabled = false;
        centerCursorInput.pressed = false;
        changeAPSInput.enabled = false;
        changeAPSInput.pressed = false;
    }
    
    function disableShootControls(): void {
        shootInput.enabled = false;
    }
}
