import { angleLeftInput, angleRightInput, centerCursorInput, changeAPSInput, shootInput } from "./input.possible-inputs";
import { center, changeAPS, left, revertAPS, right } from "../game/logic/game.logic.angle";
import { shootBubble } from "../game/logic/game.logic.shoot";

export function setupGameControls(): void {
    setupAngleControls();
    setupShootControls();

    function setupAngleControls(): void {
        angleLeftInput.fire = left;
        angleRightInput.fire = right;
        centerCursorInput.fire = center;
        changeAPSInput.fire = changeAPS;
        changeAPSInput.release = revertAPS;
    }

    function setupShootControls(): void {
        shootInput.fire = shootBubble;
    }
}

export function enableGameInputs(): void {
    enableAngleControls();
    enableShootControls();

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
