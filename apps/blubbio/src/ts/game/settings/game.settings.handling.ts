import { HandlingSettings } from "./i/game.settings.i.handling-settings";
import { DEFAULT_APS, TOGGLE_APS } from "./ref/game.settings.ref.all-handling-settings";

export function getHandlingSettings(): HandlingSettings {
    return {
        defaultAPS: DEFAULT_APS.refNumber.value,
        toggleAPS: TOGGLE_APS.refNumber.value,
    };
}