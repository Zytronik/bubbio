import { formatTimeNumberToString } from "../game/visuals/game.visuals.stat-display";
import { formatDateToAgoText } from "./page.page-manager";

export interface StatDisplay {
    fullName: string;
    shortName: string;
    isTime: boolean;
    value?: number;
}

export const statDisplays: Record<string, StatDisplay> = {
    submittedAt: {
        fullName: "Submitted At",
        shortName: "",
        isTime: true,
    },
    gameDuration: {
        fullName: "Game Duration",
        shortName: "",
        isTime: true,
    },
    bubblesCleared: {
        fullName: "Bubbles Cleared",
        shortName: "",
        isTime: false,
    },
    bubblesShot: {
        fullName: "Bubbles Shot",
        shortName: "",
        isTime: false,
    },
    bubblesPerSecond: {
        fullName: "Bubbles Per Second",
        shortName: "bps",
        isTime: false,
    },
    highestBubbleClear: {
        fullName: "Highest Bubble Clear",
        shortName: "",
        isTime: false,
    },
    wallBounces: {
        fullName: "Wall Bounces",
        shortName: "",
        isTime: false,
    },
    wallBounceClears: {
        fullName: "Wall Bounce Clears",
        shortName: "",
        isTime: false,
    },
    highestCombo: {
        fullName: "Highest Combo",
        shortName: "",
        isTime: false,
    },
    keysPressed: {
        fullName: "Keys Pressed",
        shortName: "",
        isTime: false,
    },
    keysPerSecond: {
        fullName: "Keys Per Second",
        shortName: "kps",
        isTime: false,
    },
    keysPerBubble: {
        fullName: "Keys Per Bubble",
        shortName: "",
        isTime: false,
    },
    angleChanged: {
        fullName: "Angle Changed",
        shortName: "",
        isTime: false,
    },
    angleChangePerBubble: {
        fullName: "Angle Change Per Bubble",
        shortName: "",
        isTime: false,
    },
    holds: {
        fullName: "Holds",
        shortName: "",
        isTime: false,
    },
};

export function getStatDisplay(statName: string): StatDisplay | undefined {
    return statDisplays[statName];
}

export function getFullName(fieldName: string): string {
    const statDisplay = getStatDisplay(fieldName);
    return statDisplay ? statDisplay.fullName : fieldName;
}

export function formatFieldValue(value: string | number, fieldName: string): string {
    const statDisplay = getStatDisplay(fieldName);
    let formattedValue = value;

    if (statDisplay && statDisplay.isTime && typeof value === 'number') {
        formattedValue = formatTimeNumberToString(value);
    }

    if (statDisplay && statDisplay.isTime && fieldName === 'submittedAt') {
        //formattedValue = formatDateTime(new Date(value));
        formattedValue = formatDateToAgoText(new Date(value));
    }

    if (statDisplay && statDisplay.shortName) {
        formattedValue += ` ${statDisplay.shortName}`;
    }

    return String(formattedValue);
}
