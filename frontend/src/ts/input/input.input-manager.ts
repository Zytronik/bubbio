import { angleCenter, angleLeft, angleRight, changeAPS, debugTriggerGarbage, resetGame, revertAPS, triggerHold, triggerShoot } from "../game/game.master";
import { network_clearOngoingGames, network_getOngoingGames } from "../game/network/game.network.debug";
import { DEFAULT_APS, TOGGLE_APS } from "../game/settings/ref/game.settings.ref.all-handling-settings";
import { NumberSetting } from "../game/settings/ref/i/game.settings.ref.i.number-setting";
import { checkUserAuthentication } from "../networking/networking.auth";
import { httpClient } from "../networking/networking.http-client";
import { openChannelOverlay } from "../page/page.page-manager";
import { Input } from "./i/input.i.input";
import { allInputs, angleLeftInput, angleRightInput, centerCursorInput, changeAPSInput, debugTriggerGarbageInput, backInput, holdInput, resetInput, shootInput, defaultBlocker, channelInput, debugNetwork2, debugNetwork3, debugNetwork1 } from "./input.all-inputs";

export function enableGameInputs(): void {
    angleLeftInput.fire = angleLeft;
    angleRightInput.fire = angleRight;
    centerCursorInput.fire = angleCenter;
    changeAPSInput.fire = changeAPS;
    changeAPSInput.release = revertAPS;
    shootInput.fire = triggerShoot;
    holdInput.fire = triggerHold;
    debugTriggerGarbageInput.fire = debugTriggerGarbage;

    angleLeftInput.enabled = true;
    angleRightInput.enabled = true;
    centerCursorInput.enabled = true;
    changeAPSInput.enabled = true;
    shootInput.enabled = true;
    holdInput.enabled = true;
    debugTriggerGarbageInput.enabled = true;

    defaultBlocker.enabled = true;
}

export function disableGameInputs(): void {
    angleLeftInput.enabled = false;
    angleRightInput.enabled = false;
    centerCursorInput.enabled = false;
    changeAPSInput.enabled = false;
    shootInput.enabled = false;
    holdInput.enabled = false;
    debugTriggerGarbageInput.enabled = false;

    angleLeftInput.pressed = false;
    angleRightInput.pressed = false;
    centerCursorInput.pressed = false;
    changeAPSInput.pressed = false;
    shootInput.pressed = false;
    holdInput.pressed = false;
    resetInput.pressed = false;
    debugTriggerGarbageInput.pressed = false;
    
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

export function enableNetworkDebugInputs(): void {
    // debugNetwork1.fire = network_getSpectationEntries;
    debugNetwork2.fire = network_getOngoingGames;
    debugNetwork3.fire = network_clearOngoingGames;

    debugNetwork1.enabled = true;
    debugNetwork2.enabled = true;
    debugNetwork3.enabled = true;
}

export function disableNetworkDebugInputs(): void {
    debugNetwork1.enabled = false;
    debugNetwork2.enabled = false;
    debugNetwork3.enabled = false;
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