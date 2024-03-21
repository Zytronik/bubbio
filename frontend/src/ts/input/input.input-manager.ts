import { angleCenter, angleLeft, angleRight, changeAPS, debugTriggerGarbage, resetGame, revertAPS, triggerHold, triggerShoot } from "../game/game.master";
import { network_clearOngoingGames, network_getOngoingGames, network_getSpectationEntries } from "../game/network/game.network.commands";
import { checkUserAuthentication } from "../networking/networking.auth";
import { httpClient } from "../networking/networking.http-client";
import { openChannelOverlay } from "../page/page.page-manager";
import { allInputs, angleLeftInput, angleRightInput, centerCursorInput, changeAPSInput, debugTriggerGarbageInput, backInput, holdInput, resetInput, shootInput, defaultBlocker, channelInput, debugNetworkGetOngoingGames, debugNetworkClearOngoingGames, debugNetworkGetSpectationEntries } from "./input.all-inputs";

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
    debugNetworkGetOngoingGames.fire = network_getOngoingGames;
    debugNetworkGetSpectationEntries.fire = network_getSpectationEntries;
    debugNetworkClearOngoingGames.fire = network_clearOngoingGames;

    debugNetworkGetOngoingGames.enabled = true;
    debugNetworkGetSpectationEntries.enabled = true;
    debugNetworkClearOngoingGames.enabled = true;
}

export function disableNetworkDebugInputs(): void {
    debugNetworkGetOngoingGames.enabled = false;
    debugNetworkGetSpectationEntries.enabled = false;
    debugNetworkClearOngoingGames.enabled = false;
}

export async function applySavedInputSettings(): Promise<void> {
    let settings = null;

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
            console.log(savedSetting)
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
