import { Ref, ref } from "vue";
import { Field } from "./i/gameplay.i.field";
import { Grid } from "./i/gameplay.i.grid";
import { Row } from "./i/gameplay.i.row";
import { angle } from "./gameplay.angle";
import { GRID_EXTRA_HEIGHT, GRID_HEIGHT, GRID_WIDTH } from "../game-settings/game-settings.game";
import { Coordinates } from "./i/gameplay.i.grid-coordinates";
import { calculatePreview } from "./gameplay.shoot";
import { currentBubble, prepareNextBubble } from "./gameplay.bubble-manager";

export const playGridASCII: Ref<string> = ref("");
export const playGrid: Grid = {
    visualWidth: 0,
    visualHeight: 0,
    gridWidth: 0,
    gridHeight: 0,
    extraGridHeight: 0,
    rowHeight: 0,
    rows: [],
    bubbleRadius: 0,
    bubbleLauncherPosition: { x: 0, y: 0, },
    collisionRangeSquared: 0,
}

export function setupGrid(): void {
    //todo into the game manager
    prepareNextBubble()

    const WIDTH_UNITS = 100000000;
    playGrid.visualWidth = WIDTH_UNITS;
    playGrid.gridWidth = GRID_WIDTH.value;
    playGrid.bubbleRadius = WIDTH_UNITS / (2 * playGrid.gridWidth);
    playGrid.rowHeight = Math.floor(playGrid.bubbleRadius * Math.sqrt(3));
    playGrid.visualHeight = playGrid.rowHeight * (GRID_HEIGHT.value + GRID_EXTRA_HEIGHT.value);
    playGrid.gridHeight = GRID_HEIGHT.value;
    playGrid.extraGridHeight = GRID_EXTRA_HEIGHT.value;
    playGrid.bubbleLauncherPosition = { x: WIDTH_UNITS / 2, y: playGrid.visualHeight - playGrid.bubbleRadius };
    playGrid.collisionRangeSquared = (playGrid.bubbleRadius * 2) ** 2
    for (let h = 0; h < playGrid.gridHeight + playGrid.extraGridHeight; h++) {
        const isEvenRow = (h % 2 === 0);
        const row: Row = {
            fields: [],
            size: playGrid.gridWidth - (isEvenRow ? 0 : 1),
            isEven: h % 2 === 0,
            isInDeathZone: h >= playGrid.gridHeight,
        }
        for (let w = 0; w < row.size; w++) {
            const bubbleRadius = playGrid.bubbleRadius
            const bubbleDiameter = playGrid.bubbleRadius * 2;
            const rowHeight = playGrid.rowHeight;
            const field: Field = {
                coords: {
                    x: w,
                    y: h,
                },
                centerPointCoords: {
                    x: w * bubbleDiameter + (isEvenRow ? bubbleRadius : bubbleDiameter),
                    y: rowHeight * h + playGrid.bubbleRadius,
                },
            };
            row.fields.push(field)
        }
        playGrid.rows.push(row);
    }
    generateASCIIBoard();
}

export function getNearbyFields(pointPosition: Coordinates): Field[] {
    const bubbleRadius = playGrid.bubbleRadius;
    const bubbleDiameter = playGrid.bubbleRadius * 2;
    const y = Math.round((pointPosition.y - bubbleRadius) / playGrid.rowHeight);
    const isEvenRow = playGrid.rows[y].isEven;
    const xOffSet = (isEvenRow ? bubbleRadius : bubbleDiameter)
    const x = Math.round((pointPosition.x - xOffSet) / bubbleDiameter);

    const nearbyFields: Field[] = []
    for (let row = y - 1; row < y + 1; row++) {
        for (let column = x - 1; column < x + 1; column++) {
            if (playGrid.rows[row] && playGrid.rows[row].fields[column]) {
                nearbyFields.push(playGrid.rows[row].fields[column]);
            }
        }
    }
    return nearbyFields;
}

function generateASCIIBoard(): void {
    const previewPosition = calculatePreview();
    let boardText = "";
    let once = true;
    playGrid.rows.forEach(row => {
        if (row.isInDeathZone && once) {
            boardText += "|–––––––––––––––––––––––––––––––––|\n"
            once = false;
        }

        if (!row.isEven) {
            boardText += "|.. ";
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
            boardText += "..|\n";
        } else {
            boardText += "|\n";
        }
    });
    boardText += `| . . . . . . . .${getASCIIArrow()}. . . . . . . . |\n`;
    playGridASCII.value = boardText;
    requestAnimationFrame(() => generateASCIIBoard());
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

// function addGarbage(): void {

// }