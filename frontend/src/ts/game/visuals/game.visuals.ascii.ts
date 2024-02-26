import { Ref, ref } from "vue";
import { getAngle, getBubbleQueue, getCurrentBubble, getHoldBubble, getPlayGrid, updatePreviewBubble } from "../game.master";
import { Coordinates } from "../i/game.i.grid-coordinates";
import { Field } from "../i/game.i.field";

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
    updatePreviewBubble();
    const playGrid = getPlayGrid();
    const previewPosition: Coordinates = { x: -1, y: -1 };
    if (playGrid.previewBubble) {
        previewPosition.x = playGrid.previewBubble.location.x;
        previewPosition.y = playGrid.previewBubble.location.y;
    }

    const gridWidth = playGrid.rows[0].fields.length;
    let boardText = ""
    boardText += getHoldBubbleString();
    boardText += getBubbleQueueString();
    boardText += getUpperBoarderLineString(gridWidth);
    let once = true;
    playGrid.rows.forEach(row => {
        if (row.isInDeathZone && once) {
            boardText += getDeathZoneLineString(gridWidth);
            once = false;
        }
        boardText += getRegularRowString(row.fields, row.isEvenRow, previewPosition);
    });
    boardText += getArrowLineString(gridWidth);
    boardText += getLowerBoarderLineString(gridWidth);
    playGridASCII.value = boardText;
    if (asciiAnimationRunning) {
        animationFrameId = requestAnimationFrame(() => asciiBoardAnimation());
    }
}

function getUpperBoarderLineString(gridWidth: number): string {
    let boarderLine = "╭─";
    for (let i = 0; i < gridWidth; i++) {
        boarderLine += "────";
    }
    boarderLine += "╮\n";
    return boarderLine;
}

function getLowerBoarderLineString(gridWidth: number): string {
    let boarderLine = "╰─";
    for (let i = 0; i < gridWidth; i++) {
        boarderLine += "────";
    }
    boarderLine += "╯\n";
    return boarderLine;
}

function getDeathZoneLineString(gridWidth: number): string {
    let deathZoneLine = "├┅";
    for (let i = 0; i < gridWidth; i++) {
        deathZoneLine += "┅┅┅┅";
    }
    deathZoneLine += "┤\n";
    return deathZoneLine;
}

function getRegularRowString(fields: Field[], isEvenRow: boolean, previewPosition: Coordinates): string {
    let rowString = "";
    rowString += isEvenRow ? "│ " : "│&nbsp;&nbsp;&nbsp;";

    fields.forEach(field => {
        if (previewPosition.x === field.coords.x && previewPosition.y === field.coords.y) {
            rowString += `|${getCurrentBubble().ascii}| `;
        } else {
            rowString += field.bubble ? `(${field.bubble.ascii}) ` : "--- ";
        }
    });

    rowString += isEvenRow ? "│\n" : "&nbsp;&nbsp;│\n";
    return rowString;
}

function getArrowLineString(gridWidth: number): string {
    let arrowLine = "│ ";
    const isEvenRow = gridWidth % 2 === 0;

    for (let i = 0; i < (gridWidth / 2) - 1; i++) {
        arrowLine += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    arrowLine += isEvenRow ? `&nbsp;&nbsp;&nbsp;${getASCIIArrow()}&nbsp;&nbsp;&nbsp;&nbsp;` : ` ${getASCIIArrow()}  `
    for (let i = 0; i < (gridWidth / 2) - 1; i++) {
        arrowLine += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }

    arrowLine += "│\n";
    return arrowLine;
}

function getHoldBubbleString(): string {
    const holdBubble = getHoldBubble();
    return `Hold: ${holdBubble ? `(${holdBubble.ascii})` : ""}` + "\n";
}

function getBubbleQueueString(): string {
    const queue = getBubbleQueue();
    let queueString = `Queue: (${queue[0].ascii}) |`;
    for (let i = 1; i < queue.length; i++) {
        queueString += ` (${queue[i].ascii}) `;
    }
    return queueString + "\n\n";
}

function getASCIIArrow(): string {
    const currentAngle = getAngle();
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