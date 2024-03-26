import { Coordinates } from "../i/game.i.grid-coordinates";
import { Field } from "../i/game.i.field";
import { AsciiBoardRefs } from "./i/game.visuals.i.ascii-board";
import { GameInstance } from "../i/game.i.game-instance";
import { playerGameInstance, playerGameVisuals } from "../game.master";
import { calculatePreview } from "../logic/game.logic.shoot";
import { Bubble } from "../i/game.i.bubble";

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
        showASCIICountdownNumber(0, playerGameInstance, playerGameVisuals.asciiBoard);
    } else if (elapsedTime < countdownDuration / 2) {
        showASCIICountdownNumber(1, playerGameInstance, playerGameVisuals.asciiBoard);
    } else if (elapsedTime < countdownDuration / 4 * 3) {
        showASCIICountdownNumber(2, playerGameInstance, playerGameVisuals.asciiBoard);
    } else {
        showASCIICountdownNumber(3, playerGameInstance, playerGameVisuals.asciiBoard);
    }
    if (elapsedTime < countdownDuration && countdownAnimationRunning) {
        countdownAnimationFrameId = requestAnimationFrame(() => asciiCountdownAnimation());
    } else {
        stopCountdownAnimation();
        onCountdownFinished();
    }
}

function asciiBoardAnimation(): void {
    fillAsciiStrings(playerGameInstance, playerGameVisuals.asciiBoard);
    if (asciiAnimationRunning) {
        asciiAnimationFrameId = requestAnimationFrame(() => asciiBoardAnimation());
    }
}

export function fillAsciiStrings(gameInstance: GameInstance, asciiRefs: AsciiBoardRefs): void {
    calculatePreview(gameInstance);
    const playGrid = gameInstance.playGrid
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
        boardText += getRegularRowString(row.fields, row.isSmallerRow, previewPosition, gameInstance.currentBubble);
    });
    boardText += getArrowLineString(gameInstance.playGrid.gridWidth, gameInstance.angle);
    boardText += getLowerBoarderLineString(gridWidth);
    asciiRefs.playGridASCII.value = boardText;
    asciiRefs.holdString.value = getHoldBubbleString(gameInstance.holdBubble);
    asciiRefs.queueString.value = getBubbleQueueString(gameInstance.currentBubble, gameInstance.bubbleQueue, gameInstance.gameSettings.queuePreviewSize);
    asciiRefs.incomingGarbage.value = getIncomingGarbageString(gameInstance.queuedGarbage, gameInstance.playGrid.gridHeight + gameInstance.playGrid.extraGridHeight);
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

function getRegularRowString(fields: Field[], isSmallerRow: boolean, previewPosition: Coordinates, currrentBubble: Bubble): string {
    let rowString = "";
    rowString += isSmallerRow ? "│&nbsp;&nbsp;&nbsp;" : "│ ";

    fields.forEach(field => {
        if (previewPosition.x === field.coords.x && previewPosition.y === field.coords.y) {
            rowString += `|${currrentBubble.ascii}| `;
        } else {
            rowString += field.bubble ? `(${field.bubble.ascii}) ` : "--- ";
        }
    });

    rowString += isSmallerRow ? "&nbsp;&nbsp;│\n" : "│\n";
    return rowString;
}

function getArrowLineString(gridWidth: number, angle: number): string {
    let arrowLine = "│ ";
    const isEvenRow = gridWidth % 2 === 0;

    for (let i = 0; i < (gridWidth / 2) - 1; i++) {
        arrowLine += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    arrowLine += isEvenRow ? `&nbsp;&nbsp;&nbsp;${getASCIIArrow(angle)}&nbsp;&nbsp;&nbsp;&nbsp;` : ` ${getASCIIArrow(angle)}&nbsp;&nbsp;`
    for (let i = 0; i < (gridWidth / 2) - 1; i++) {
        arrowLine += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }

    arrowLine += "│\n";
    return arrowLine;
}

function getHoldBubbleString(holdBubble: Bubble | undefined): string {
    return `Hold: ${holdBubble ? `(${holdBubble.ascii})` : ""}` + "\n";
}

function getBubbleQueueString(currentBubble: Bubble, bubbleQueue: Bubble[], previewLength: number): string {
    let queueString = `Queue: (${currentBubble.ascii}) |`;
    for (let i = 0; i < previewLength; i++) {
        queueString += ` (${bubbleQueue[i].ascii}) `;
    }
    return queueString + "\n\n";
}

function getIncomingGarbageString(garbageAmount: number, gridtotalHeight: number): string {
    const stringWidth = gridtotalHeight;
    let queueString = "╭";
    for (let i = 0; i < stringWidth; i++) {
        queueString += "─";
    }
    queueString += "╮\n│"

    for (let i = 0; i < stringWidth; i++) {
        if (i < garbageAmount) {
            queueString += "▓";
        } else {
            queueString += "░";
        }
    }
    queueString += "│\n╰"

    for (let i = 0; i < stringWidth; i++) {
        queueString += "─";
    }
    queueString += "╯"
    return queueString + "\n\n";
}

function getASCIIArrow(angle: number): string {
    if (angle < 22.5) {
        return "←"
    }
    if (angle < 67.5) {
        return "↖"
    }
    if (angle < 112.5) {
        return "↑"
    }
    if (angle < 157.5) {
        return "↗"
    }
    return "→"
}

function showASCIICountdownNumber(counter: number, gameInstance: GameInstance, asciiRefs: AsciiBoardRefs): void {
    const countDownSteps = [countDown3, countDown2, countDown1, countDownGO];
    fillAsciiStrings(gameInstance, asciiRefs);
    const victoryBoard = asciiRefs.playGridASCII.value;
    const topRows = victoryBoard.split('\n').slice(0, 7).join('\n');
    const bottomRows = victoryBoard.split('\n').slice(12).join('\n');
    const finalBoardText = topRows + countDownSteps[counter] + bottomRows;
    asciiRefs.playGridASCII.value = finalBoardText;
}

export function showASCIIVictory(gameInstance: GameInstance, asciiRefs: AsciiBoardRefs): void {
    stopASCIIAnimation();
    fillAsciiStrings(gameInstance, asciiRefs);
    const victoryBoard = asciiRefs.playGridASCII.value;
    const topRows = victoryBoard.split('\n').slice(0, 7).join('\n');
    const bottomRows = victoryBoard.split('\n').slice(12).join('\n');
    const finalBoardText = topRows + victoryASCII + bottomRows;
    asciiRefs.playGridASCII.value = finalBoardText;
}

export function showASCIIDefeat(gameInstance: GameInstance, asciiRefs: AsciiBoardRefs): void {
    stopASCIIAnimation();
    fillAsciiStrings(gameInstance, asciiRefs);
    const lossBoard = asciiRefs.playGridASCII.value;
    const topRows = lossBoard.split('\n').slice(0, 7).join('\n');
    const bottomRows = lossBoard.split('\n').slice(12).join('\n');
    const finalBoardText = topRows + defeatASCII + bottomRows;
    asciiRefs.playGridASCII.value = finalBoardText;
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