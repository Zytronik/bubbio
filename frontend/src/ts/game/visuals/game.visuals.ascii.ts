import { Ref, ref } from "vue";
import { getAngle, getBubbleQueue, getCurrentBubble, getGridTotalHeight, getHoldBubble, getIncomingGarbageAmount, getPlayGrid, getQueueSize, updatePreviewBubble } from "../game.master";
import { Coordinates } from "../i/game.i.grid-coordinates";
import { Field } from "../i/game.i.field";

export const playGridASCII: Ref<string> = ref("");
export const holdString: Ref<string> = ref("");
export const queueString: Ref<string> = ref("");
export const incomingGarbage: Ref<string> = ref("");

let asciiAnimationRunning = false;
let asciiAnimationFrameId: number | null = null;

let countdownAnimationRunning = false;
let countdownStartTime: number;
let countdownDuration: number;
let onCountdownFinished: () => void;
let countdownAnimationFrameId: number | null = null;

export function startASCIIAnimation(): void {
    if (!asciiAnimationRunning) {
        asciiAnimationRunning = true;
        asciiBoardAnimation();
    }
}

export function stopASCIIAnimation(): void {
    if (asciiAnimationRunning && asciiAnimationFrameId !== null) {
        asciiAnimationRunning = false;
        cancelAnimationFrame(asciiAnimationFrameId);
        asciiAnimationFrameId = null;
    }
}

export function startCountdownAnimation(duration: number, onFinished: () => void): void {
    if (!countdownAnimationRunning) {
        countdownAnimationRunning = true;
        countdownStartTime = performance.now();
        countdownDuration = duration;
        onCountdownFinished = onFinished;
        requestAnimationFrame(asciiCountdownAnimation);
    }
}

export function stopCountdownAnimation(): void {
    if (countdownAnimationRunning && countdownAnimationFrameId !== null) {
        countdownAnimationRunning = false;
        cancelAnimationFrame(countdownAnimationFrameId);
        countdownAnimationFrameId = null;
    }
}

function asciiCountdownAnimation(): void {
    const elapsedTime = performance.now() - countdownStartTime;
    if (elapsedTime < countdownDuration / 4) {
        showASCIICountdownNumber(0);
    } else if (elapsedTime < countdownDuration / 2) {
        showASCIICountdownNumber(1);
    } else if (elapsedTime < countdownDuration / 4 * 3) {
        showASCIICountdownNumber(2);
    } else {
        showASCIICountdownNumber(3);
    }
    if (elapsedTime < countdownDuration && countdownAnimationRunning) {
        countdownAnimationFrameId = requestAnimationFrame(() => asciiCountdownAnimation());
    } else {
        stopCountdownAnimation();
        onCountdownFinished();
    }
}

function asciiBoardAnimation(): void {
    fillAsciiStrings();
    if (asciiAnimationRunning) {
        asciiAnimationFrameId = requestAnimationFrame(() => asciiBoardAnimation());
    }
}

export function fillAsciiStrings(): void {
    updatePreviewBubble();
    const playGrid = getPlayGrid();
    const previewPosition: Coordinates = { x: -1, y: -1 };
    if (playGrid.previewBubble) {
        previewPosition.x = playGrid.previewBubble.location.x;
        previewPosition.y = playGrid.previewBubble.location.y;
    }

    const gridWidth = playGrid.gridWidth;
    let boardText = ""
    boardText += getUpperBoarderLineString(gridWidth);
    let once = true;
    playGrid.rows.forEach(row => {
        if (row.isInDeathZone && once) {
            boardText += getDeathZoneLineString(gridWidth);
            once = false;
        }
        boardText += getRegularRowString(row.fields, row.isSmallerRow, previewPosition);
    });
    boardText += getArrowLineString(gridWidth);
    boardText += getLowerBoarderLineString(gridWidth);
    playGridASCII.value = boardText;
    holdString.value = getHoldBubbleString();
    queueString.value = getBubbleQueueString();
    incomingGarbage.value = getIncomingGarbageString();
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

function getRegularRowString(fields: Field[], isSmallerRow: boolean, previewPosition: Coordinates): string {
    let rowString = "";
    rowString += isSmallerRow ? "│&nbsp;&nbsp;&nbsp;" : "│ ";

    fields.forEach(field => {
        if (previewPosition.x === field.coords.x && previewPosition.y === field.coords.y) {
            rowString += `|${getCurrentBubble().ascii}| `;
        } else {
            rowString += field.bubble ? `(${field.bubble.ascii}) ` : "--- ";
        }
    });

    rowString += isSmallerRow ? "&nbsp;&nbsp;│\n" : "│\n";
    return rowString;
}

function getArrowLineString(gridWidth: number): string {
    let arrowLine = "│ ";
    const isEvenRow = gridWidth % 2 === 0;

    for (let i = 0; i < (gridWidth / 2) - 1; i++) {
        arrowLine += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    arrowLine += isEvenRow ? `&nbsp;&nbsp;&nbsp;${getASCIIArrow()}&nbsp;&nbsp;&nbsp;&nbsp;` : ` ${getASCIIArrow()}&nbsp;&nbsp;`
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
    const current = getCurrentBubble();
    let queueString = `Queue: (${current.ascii}) |`;
    for (let i = 0; i < getQueueSize(); i++) {
        queueString += ` (${queue[i].ascii}) `;
    }
    return queueString + "\n\n";
}

function getIncomingGarbageString(): string {
    const garbageAmount = getIncomingGarbageAmount();
    const width = getGridTotalHeight();
    let queueString = "╭";
    for (let i = 0; i < width; i++) {
        queueString += "─";
    }
    queueString += "╮\n│"

    for (let i = 0; i < width; i++) {
        if (i < garbageAmount) {
            queueString += "▓";
        } else {
            queueString += "░";
        }
    }
    queueString += "│\n╰"

    for (let i = 0; i < width; i++) {
        queueString += "─";
    }
    queueString += "╯"
    return queueString;
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

function showASCIICountdownNumber(counter: number): void {
    const countDownSteps = [countDown3, countDown2, countDown1, countDownGO];
    fillAsciiStrings();
    const victoryBoard = playGridASCII.value
    const topRows = victoryBoard.split('\n').slice(0, 7).join('\n');
    const bottomRows = victoryBoard.split('\n').slice(12).join('\n');
    const finalBoardText = topRows + countDownSteps[counter] + bottomRows;
    playGridASCII.value = finalBoardText;
}

export function showASCIIVictory(): void {
    stopASCIIAnimation();
    fillAsciiStrings();
    const victoryBoard = playGridASCII.value
    const topRows = victoryBoard.split('\n').slice(0, 7).join('\n');
    const bottomRows = victoryBoard.split('\n').slice(12).join('\n');
    const finalBoardText = topRows + victoryASCII + bottomRows;
    playGridASCII.value = finalBoardText;
}

export function showASCIIDefeat(): void {
    stopASCIIAnimation();
    fillAsciiStrings();
    const lossBoard = playGridASCII.value
    const topRows = lossBoard.split('\n').slice(0, 7).join('\n');
    const bottomRows = lossBoard.split('\n').slice(12).join('\n');
    const finalBoardText = topRows + defeatASCII + bottomRows;
    playGridASCII.value = finalBoardText;
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

const countDown3 = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█████████████████████ ▄▄ ████████████████████
███████████████████████▄▀████████████████████
█████████████████████ ▀▀ ████████████████████
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`;

const countDown2 = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█████████████████████ ▄ ████████████████████
██████████████████████▀▄████████████████████
█████████████████████ ▀▀████████████████████
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`;

const countDown1 = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█████████████████████▀ █████████████████████
██████████████████████ █████████████████████
█████████████████████▀ ▀████████████████████
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`;

const countDownGO = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
██████████████████ ▄▄ ██ ▄▄▄ █ ████████████████
██████████████████ █▀▀██ ███ █▄████████████████
██████████████████ ▀▀▄██ ▀▀▀ █▀████████████████
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`;