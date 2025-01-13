import { formatTimeNumberToString } from "../../game/visuals/game.visuals.stat-display";
import { formatDateToAgoText } from "../page.page-utils";

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
        fullName: "Duration",
        shortName: "",
        isTime: true,
    },
    bubblesCleared: {
        fullName: "Cleared",
        shortName: "",
        isTime: false,
    },
    bubblesShot: {
        fullName: "Bubbles Shot",
        shortName: "",
        isTime: false,
    },
    bubblesPerSecond: {
        fullName: "Bubbl. Per Sec.",
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
    clear3	: {
        fullName: "Triples",
        shortName: "",
        isTime: false,
    },
    clear4: {
        fullName: "Quads",
        shortName: "",
        isTime: false,
    },
    clear5: {
        fullName: "Quints +",
        shortName: "",
        isTime: false,
    },
    clear3wb: {
        fullName: "Wall Bounce Triples",
        shortName: "",
        isTime: false,
    },
    clear4wb: {
        fullName: "Wall Bounce Quads",
        shortName: "",
        isTime: false,
    },
    clear5wb: {
        fullName: "Wall Bounce Quints +",
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
        formattedValue = formatDateToAgoText(new Date(value));
    }

    if (statDisplay && statDisplay.shortName) {
        formattedValue += ` ${statDisplay.shortName}`;
    }

    return String(formattedValue);
}
