import { Coordinates } from "../../_interface/game.i.grid-coordinates";
import { Field } from "../../_interface/game.i.field";
import { AsciiBoardRefs } from "../../_interface/game.visuals.i.ascii-board";
import { GameInstance } from "../../_interface/game.i.game-instance";
import { playerGameInstance, playerGameVisuals, setGameStateAndNotify } from "../game.master";
import { calculatePreview } from "../logic/game.logic.shoot";
import { Bubble } from "../../_interface/game.i.bubble";
import { GAME_STATE } from "../../_constant/game.e.state";
import { PreviewBubble } from "../../_interface/game.i.preview-bubble";
import { playSound } from "@/ts/preload/asset.howler-load";

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
        fillAsciiStrings(playerGameInstance, playerGameVisuals.asciiBoard);
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

let hasPlayedSoundGo = false;
let hasPlayedSound1 = false;
let hasPlayedSound2 = false;
let hasPlayedSound3 = false;

function asciiCountdownAnimation(): void {
    const elapsedTime = performance.now() - countdownStartTime;
    const asciiRefs = playerGameVisuals.asciiBoard;
    if (elapsedTime < countdownDuration / 4) {
        asciiRefs.floatingText.value = showASCIICountdownNumber(0);
        if(!hasPlayedSound3){
            playSound("countDown3");
            hasPlayedSound3 = true;
        }
        setGameStateAndNotify(GAME_STATE.COUNTDOWN_3);
    } else if (elapsedTime < countdownDuration / 2) {
        asciiRefs.floatingText.value = showASCIICountdownNumber(1);
        if(!hasPlayedSound2){
            playSound("countDown2");
            hasPlayedSound2 = true;
        }
        setGameStateAndNotify(GAME_STATE.COUNTDOWN_2);
    } else if (elapsedTime < countdownDuration / 4 * 3) {
        asciiRefs.floatingText.value = showASCIICountdownNumber(2);
        if(!hasPlayedSound1){
            playSound("countDown1");
            hasPlayedSound1 = true;
        }
        setGameStateAndNotify(GAME_STATE.COUNTDOWN_1);
    } else {
        asciiRefs.floatingText.value = showASCIICountdownNumber(3);
        if(!hasPlayedSoundGo){
            playSound("countDownGo");
            hasPlayedSoundGo = true;
        }
        setGameStateAndNotify(GAME_STATE.COUNTDOWN_GO);
    }
    if (elapsedTime < countdownDuration && countdownAnimationRunning) {
        countdownAnimationFrameId = requestAnimationFrame(() => asciiCountdownAnimation());
    } else {
        stopCountdownAnimation();
        setGameStateAndNotify(GAME_STATE.IN_GAME);
        onCountdownFinished();
        hasPlayedSoundGo = false;
        hasPlayedSound1 = false;
        hasPlayedSound2 = false;
        hasPlayedSound3 = false;
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

    let boardText = ""
    if (gameInstance.playGrid.previewBubble) {
        boardText += getTravelLineString(gameInstance.playGrid.previewBubble, gameInstance.playGrid.precisionWidth, gameInstance.playGrid.precisionHeight);
    }
    let once = true;
    playGrid.rows.forEach(row => {
        if (row.isInDeathZone && once) {
            boardText += getDeathZoneLineString();
            once = false;
        }
        boardText += getRegularRowString(row.fields, row.isSmallerRow, previewPosition, gameInstance.currentBubble, gameInstance.holdBubble);
    });
    boardText += getArrowLineString(gameInstance.angle, gameInstance.currentBubble);
    asciiRefs.playGridASCII.value = boardText;
    asciiRefs.holdString.value = getHoldString(gameInstance.holdBubble);
    asciiRefs.queueString.value = getBubbleQueueString(gameInstance.bubbleQueue, gameInstance.gameSettings.queuePreviewSize);
    asciiRefs.incomingGarbage.value = getIncomingGarbageString(gameInstance.queuedGarbage, gameInstance.playGrid.gridHeight + gameInstance.playGrid.extraGridHeight);
    if (gameInstance.gameState === GAME_STATE.VICTORY_SCREEN) {
        asciiRefs.floatingText.value = victoryASCII;
    } else if (gameInstance.gameState === GAME_STATE.DEFEAT_SCREEN) {
        asciiRefs.floatingText.value = defeatASCII;
    } else if (gameInstance.gameState === GAME_STATE.COUNTDOWN_GO) {
        asciiRefs.floatingText.value = countDownGO;
    } else if (gameInstance.gameState === GAME_STATE.COUNTDOWN_3) {
        asciiRefs.floatingText.value = countDown3;
    } else if (gameInstance.gameState === GAME_STATE.COUNTDOWN_2) {
        asciiRefs.floatingText.value = countDown2;
    } else if (gameInstance.gameState === GAME_STATE.COUNTDOWN_1) {
        asciiRefs.floatingText.value = countDown1;
    } else if (gameInstance.gameState === GAME_STATE.IS_IN_MENU) {
        asciiRefs.floatingText.value = inMenu;
    } else if (gameInstance.gameState === GAME_STATE.DISCONNECTED) {
        asciiRefs.floatingText.value = disconnected;
    } else {
        asciiRefs.floatingText.value = "";
    }
}

function getHoldString(holdBubble: Bubble | undefined): string {
    return "<div class='hold-piece'>"+(holdBubble ? holdBubble.ascii : "")+"</div>";
}

function getDeathZoneLineString(): string {
    return "<div class='deathZoneLine'></div>";
}

function getRegularRowString(fields: Field[], isSmallerRow: boolean, previewPosition: Coordinates, currrentBubble: Bubble, holdBubble: Bubble | undefined): string {
    let rowString = "";
    rowString += isSmallerRow ? "<div class='row small'>" : "<div class='row'>";

    fields.forEach(field => {
        if (previewPosition.x === field.coords.x && previewPosition.y === field.coords.y) {
            let cssClass = "";
            if(currrentBubble.type === 6){
                cssClass = "colorBlindWhite";
            }else if(currrentBubble.type === 3){
                cssClass = "colorBlindGreen";
            }
            rowString += `<div class="preview ${cssClass}">${currrentBubble.ascii}<div class="hold">${holdBubble ? holdBubble.ascii : ""}</div></div>`;
        } else {
            rowString += field.bubble ? `${field.bubble.ascii} ` : "<div class='field empty'></div>";
        }
    });

    rowString += "</div>";
    return rowString;
}

function getArrowLineString(angle: number, currentBubble: Bubble): string {
    return "<div class='arrowLine'>"+
        "<div class='crossbow' style='transform: translate(-50%, 50%) rotate(" + angle + "deg)'>"+
            "<div class='current-piece' style='transform: rotate(-" + angle + "deg)'>" + currentBubble.ascii + "</div>"+
        "</div>"+
    "</div>";
}

function getTravelLineString(previewBubble: PreviewBubble, gridWidth: number, gridHeight: number): string {
    const boardWidth = document.querySelector(".board")?.clientWidth || 0;
    const boardHeight = document.querySelector(".board")?.clientHeight || 0;
    let lineString = `<svg class="trajectory">`;
    for (let i = 0; i < previewBubble.travelLine.length-1; i++) {
        const startX = previewBubble.travelLine[i].x / gridWidth * boardWidth;
        const startY = previewBubble.travelLine[i].y / gridHeight * boardHeight;
        const endX = previewBubble.travelLine[i + 1].x / gridWidth * boardWidth;
        const endY = previewBubble.travelLine[i + 1].y / gridHeight * boardHeight;
        lineString += `<polyline points="${startX},${startY} ${endX},${endY}"></polyline>`
    }
    lineString += `</svg>`;
    return lineString;
}

function getBubbleQueueString(bubbleQueue: Bubble[], previewLength: number): string {
    let queueString = "";
    for (let i = 0; i < previewLength; i++) {
        queueString += ` ${bubbleQueue[i].ascii} `;
    }
    return queueString;
}

function getIncomingGarbageString(garbageAmount: number, gridtotalHeight: number): string {
    const barHeight = 100 / gridtotalHeight * garbageAmount;
    return "<div style='height: "+barHeight+"%' class='garbage'></div>";
}

function showASCIICountdownNumber(counter: number): string {
    const countDownSteps = [countDown3, countDown2, countDown1, countDownGO];
    return countDownSteps[counter];
}

const victoryASCII = `YOU WON!`;
const defeatASCII = `YOU LOST!`;
const countDown3 = `3`;
const countDown2 = `2`;
const countDown1 = `1`;
const countDownGO = `GO!`;
const inMenu = `IN MENU`;
const disconnected = `DISCONNECTED`;