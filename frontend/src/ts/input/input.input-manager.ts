import { angleCenter, angleLeft, angleMirror, angleRight, changeAPS, debugTriggerGarbage, resetGame, revertAPS, triggerHold, triggerShoot } from "../game/game.master";
import { DEFAULT_APS, TOGGLE_APS } from "../game/settings/ref/game.settings.ref.all-handling-settings";
import { checkUserAuthentication } from "../networking/networking.auth";
import { httpClient } from "../networking/networking.http-client";
import { openChannelOverlay } from "../page/page.page-manager";
import { Input } from "./i/input.i.input";
import { allInputs, angleLeftInput, angleRightInput, centerCursorInput, changeAPSInput, backInput, holdInput, resetInput, shootInput, defaultBlocker, channelInput, mirrorCursorInput } from "./input.all-inputs";

export function enableGameInputs(): void {
    angleLeftInput.fire = angleLeft;
    angleRightInput.fire = angleRight;
    centerCursorInput.fire = angleCenter;
    mirrorCursorInput.fire = angleMirror;
    changeAPSInput.fire = changeAPS;
    changeAPSInput.release = revertAPS;
    shootInput.fire = triggerShoot;
    holdInput.fire = triggerHold;

    angleLeftInput.enabled = true;
    angleRightInput.enabled = true;
    centerCursorInput.enabled = true;
    mirrorCursorInput.enabled = true;
    changeAPSInput.enabled = true;
    shootInput.enabled = true;
    holdInput.enabled = true;

    defaultBlocker.enabled = true;
}

export function disableGameInputs(): void {
    angleLeftInput.enabled = false;
    angleRightInput.enabled = false;
    centerCursorInput.enabled = false;
    mirrorCursorInput.enabled = false;
    changeAPSInput.enabled = false;
    shootInput.enabled = false;
    holdInput.enabled = false;

    angleLeftInput.pressed = false;
    angleRightInput.pressed = false;
    centerCursorInput.pressed = false;
    mirrorCursorInput.pressed = false;
    changeAPSInput.pressed = false;
    shootInput.pressed = false;
    holdInput.pressed = false;
    resetInput.pressed = false;
    
    defaultBlocker.enabled = false;
}

export function enableResetInput(): void {
    resetInput.fire = resetGame;
    resetInput.enabled = true;
}

export function disableResetInput(): void {
    resetInput.enabled = false;
}

export function enableBackInputs(): void {
    backInput.enabled = true;
}

export function disableBackInputs(): void {
    backInput.enabled = false;
}

export function enableChannelInput(): void {
    channelInput.fire = openChannelOverlay;
    channelInput.enabled = true;
}

export function disableChannelInput(): void {
    channelInput.enabled = false;
}

interface Settings {
    handleSettings: { toggleAPS: number, defaultAPS: number },
    inputSettings: Input[]
}

export async function applySavedSettings(): Promise<void> {
    let settings: Settings | null = null;

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
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    }

    if (settings && Array.isArray(settings.inputSettings)) {
        settings.inputSettings.forEach(inputSetting => {
            const input = allInputs.find(input => input.name === inputSetting.name);
            if (input && inputSetting.customKeyMap) {

                input.customKeyMap = inputSetting.customKeyMap;
            }
        });

        DEFAULT_APS.refNumber.value = settings.handleSettings.defaultAPS ?? DEFAULT_APS.defaultValue;
        TOGGLE_APS.refNumber.value = settings.handleSettings.toggleAPS ?? TOGGLE_APS.defaultValue;
    }
}

export async function saveSettings() {
    const settings = {
        "handleSettings": {"toggleAPS" : TOGGLE_APS.refNumber.value, "defaultAPS": DEFAULT_APS.refNumber.value},
        "inputSettings": allInputs
    }
    if (checkUserAuthentication() && !sessionStorage.getItem('isGuest')) { //if is logged in
        try {
            const token = localStorage.getItem('authToken');
            const payload = { settings: JSON.stringify(settings) };
            await httpClient.post('/users/settings/update', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error submitting Settings:', error);
        }
    } else {
        localStorage.setItem('settings', JSON.stringify(settings));
    }
}