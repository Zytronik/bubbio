import { Ref, ref } from "vue";
import { getPlayGridRows } from "../logic/game.logic.playgrid";
import { getCurrentBubble } from "../logic/game.logic.bubble-manager";
import { calculatePreview } from "../logic/game.logic.shoot";
import { angle } from "../logic/game.logic.angle";

export const playGridASCII: Ref<string> = ref("");

let animationFrameId: number | null = null;
let asciiAnimationRunning = false;

export function startASCIIAnimation(): void {
    if (!asciiAnimationRunning) {
        asciiAnimationRunning = true;
        asciiBoardAnimation();
    }
}

export function stopASCIIAnimation(): void {
    if (asciiAnimationRunning && animationFrameId !== null) {
        asciiAnimationRunning = false;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

export function showASCIIVictory(): void {
    stopASCIIAnimation();
    const victoryBoard = playGridASCII.value
    const topRows = victoryBoard.split('\n').slice(0, 7).join('\n');
    const bottomRows = victoryBoard.split('\n').slice(12).join('\n');
    const finalBoardText = topRows + victoryASCII + bottomRows;
    playGridASCII.value = finalBoardText;
}

export function showASCIIDefeat(): void {
    stopASCIIAnimation();
    const lossBoard = playGridASCII.value
    const topRows = lossBoard.split('\n').slice(0, 7).join('\n');
    const bottomRows = lossBoard.split('\n').slice(12).join('\n');
    const finalBoardText = topRows + defeatASCII + bottomRows;
    playGridASCII.value = finalBoardText;
}

function asciiBoardAnimation(): void {
    const previewPosition = calculatePreview();
    let boardText = "___________________________________\n";
    let once = true;
    getPlayGridRows().forEach(row => {
        if (row.isInDeathZone && once) {
            boardText += "|–––––––––––––––––––––––––––––––––|\n"
            once = false;
        }

        if (!row.isEvenRow) {
            boardText += "| . ";
        } else {
            boardText += "| ";
        }

        row.fields.forEach(field => {
            if (previewPosition.x === field.coords.x && previewPosition.y === field.coords.y) {
                boardText += `|${getCurrentBubble().ascii}| `;
            } else {
                const bubbleASCII = field.bubble ? field.bubble.ascii : "-";
                if (bubbleASCII != "-") {
                    boardText += `(${bubbleASCII}) `;
                } else {
                    boardText += `-${bubbleASCII}- `;
                }
            }
        });

        if (!row.isEvenRow) {
            boardText += ". |\n";
        } else {
            boardText += "|\n";
        }
    });
    boardText += `| . . . . . . . .${getASCIIArrow()}. . . . . . . . |\n`;
    playGridASCII.value = boardText;
    if (asciiAnimationRunning) {
        animationFrameId = requestAnimationFrame(() => asciiBoardAnimation());
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