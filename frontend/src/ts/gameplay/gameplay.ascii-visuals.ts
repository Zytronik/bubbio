import { Ref, ref } from "vue";
import { playGrid } from "./gameplay.playgrid";
import { currentBubble } from "./gameplay.bubble-manager";
import { calculatePreview } from "./gameplay.shoot";
import { angle } from "./gameplay.angle";

export const playGridASCII: Ref<string> = ref("");

let asciiAnimationRunning = false;
export function startASCIIAnimation(): void {
    asciiAnimationRunning = true;
    asciiBoardAnimation();
}

export function stopASCIIAnimation(): void {
    asciiAnimationRunning = false;
}

export function showASCIIVictory(): void {
    stopASCIIAnimation();
    playGridASCII.value = victoryASCII;
}

export function showASCIIDefeat(): void {
    stopASCIIAnimation();
    playGridASCII.value = defeatASCII;
}

function asciiBoardAnimation(): void {
    const previewPosition = calculatePreview();
    let boardText = "___________________________________\\n";
    let once = true;
    playGrid.rows.forEach(row => {
        if (row.isInDeathZone && once) {
            boardText += "|–––––––––––––––––––––––––––––––––|\\n"
            once = false;
        }

        if (!row.isEven) {
            boardText += "| . ";
        } else {
            boardText += "| ";
        }

        row.fields.forEach(field => {
            if (previewPosition.x === field.coords.x && previewPosition.y === field.coords.y) {
                boardText += `|${currentBubble.ascii}| `;
            } else {
                const bubbleASCII = field.bubble ? field.bubble.ascii : "-";
                boardText += `-${bubbleASCII}- `;
            }
        });

        if (!row.isEven) {
            boardText += ". |\\n";
        } else {
            boardText += "|\\n";
        }
    });
    boardText += `| . . . . . . . .${getASCIIArrow()}. . . . . . . . |\\n`;
    playGridASCII.value = boardText;
    if (asciiAnimationRunning) {
        requestAnimationFrame(() => asciiBoardAnimation());
    }
}

function getASCIIArrow(): string {
    const currentAngle = angle.value;
    if (currentAngle < 22.5) {
        return "←"
    }
    if (currentAngle < 67.5) {
        return "↖"
    }
    if (currentAngle < 112.5) {
        return "↑"
    }
    if (currentAngle < 157.5) {
        return "↗"
    }
    return "→"
}

const victoryASCII = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
██ ███ ██ ▄▄▄ ██ ██ ████ ███ ██ ▄▄▄ ██ ▀██ █ ██
██▄▀▀▀▄██ ███ ██ ██ ████ █ █ ██ ███ ██ █ █ █▄██
████ ████ ▀▀▀ ██▄▀▀▄████▄▀▄▀▄██ ▀▀▀ ██ ██▄ █▀██
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`;

const defeatASCII = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
██ ███ ██ ▄▄▄ ██ ██ ████ █████ ▄▄▄ ██ ▄▄▄ █▄▄ ▄▄█ ██
██▄▀▀▀▄██ ███ ██ ██ ████ █████ ███ ██▄▄▄▀▀███ ███▄██
████ ████ ▀▀▀ ██▄▀▀▄████ ▀▀ ██ ▀▀▀ ██ ▀▀▀ ███ ███▀██
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`;