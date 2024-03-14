import { angleCenter, angleLeft, angleRight, changeAPS, debugTriggerGarbage, resetGame, revertAPS, triggerHold, triggerShoot } from "../game/game.master";
import { checkUserAuthentication } from "../networking/networking.auth";
import { httpClient } from "../networking/networking.http-client";
import { allInputs, angleLeftInput, angleRightInput, centerCursorInput, changeAPSInput, debugTriggerGarbageInput, holdInput, resetInput, shootInput } from "./input.possible-inputs";

export function enableGameInputs(): void {
    angleLeftInput.fire = angleLeft;
    angleRightInput.fire = angleRight;
    centerCursorInput.fire = angleCenter;
    changeAPSInput.fire = changeAPS;
    changeAPSInput.release = revertAPS;
    shootInput.fire = triggerShoot;
    holdInput.fire = triggerHold;
    resetInput.fire = resetGame;
    debugTriggerGarbageInput.fire = debugTriggerGarbage;

    angleLeftInput.enabled = true;
    angleRightInput.enabled = true;
    centerCursorInput.enabled = true;
    changeAPSInput.enabled = true;
    shootInput.enabled = true;
    holdInput.enabled = true;
    resetInput.enabled = true;
    debugTriggerGarbageInput.enabled = true;
}

export function disableGameInputs(): void {
    angleLeftInput.enabled = false;
    angleRightInput.enabled = false;
    centerCursorInput.enabled = false;
    changeAPSInput.enabled = false;
    shootInput.enabled = false;
    holdInput.enabled = false;
    resetInput.enabled = false;
    debugTriggerGarbageInput.enabled = false;

    angleLeftInput.pressed = false;
    angleRightInput.pressed = false;
    centerCursorInput.pressed = false;
    changeAPSInput.pressed = false;
    shootInput.pressed = false;
    holdInput.pressed = false;
    resetInput.pressed = false;
    debugTriggerGarbageInput.pressed = false;
}


export async function applySavedInputSettings(): Promise<void> {
    let settings = null;

    allInputs.forEach(input => {
        input.customKeyMap = { map: ["", "", ""] };
    });

    if (checkUserAuthentication() && !sessionStorage.getItem('isGuest')) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await httpClient.get('/users/settings/inputs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            settings = response.data;
        } catch (error) {
            console.error('Error fetching input settings:', error);
        }
    } else {
        const savedSettings = localStorage.getItem('userInputSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    }

    if (Array.isArray(settings)) {
        settings.forEach(savedSetting => {
            const input = allInputs.find(input => input.name === savedSetting.name);
            if (input && savedSetting.customKeyMap) {
                input.customKeyMap = savedSetting.customKeyMap;
            }
        });
    }
}

export async function saveInputs() {
    if (checkUserAuthentication() && !sessionStorage.getItem('isGuest')) { //if is logged in
        try {
            const token = localStorage.getItem('authToken');
            const payload = JSON.stringify({ inputSettings: JSON.stringify(allInputs) });
            await httpClient.post('/users/updateInputSettings', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error submitting input Settings:', error);
        }
    } else {
        localStorage.setItem('userInputSettings', JSON.stringify(allInputs));
    }
}
