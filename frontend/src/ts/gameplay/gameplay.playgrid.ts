import { Ref, ref } from "vue";
import { Field } from "./i/gameplay.i.field";
import { Grid } from "./i/gameplay.i.grid";
import { Row } from "./i/gameplay.i.row";
import { angle } from "./gameplay.angle";
import { GRID_EXTRA_HEIGHT, GRID_HEIGHT, GRID_WIDTH } from "../game-settings/game-settings.game";
import { all } from "axios";

export const playGridASCII: Ref<string> = ref("");
export const playGrid: Grid = {
    visualWidth: 0,
    visualHeight: 0,
    gridWidth: 0,
    gridHeight: 0,
    extraGridHeight: 0,
    rowHeight: 0,
    rows: [],
    bubbleRadius: 0
}

export function setupGrid(): void {
    const WIDTH_UNITS = 100000000;
    playGrid.visualWidth = WIDTH_UNITS;
    playGrid.visualHeight = Math.floor(WIDTH_UNITS/GRID_WIDTH.value*GRID_HEIGHT.value);
    playGrid.gridWidth = GRID_WIDTH.value;
    playGrid.gridHeight = GRID_HEIGHT.value;
    playGrid.extraGridHeight = GRID_EXTRA_HEIGHT.value;
    playGrid.bubbleRadius = WIDTH_UNITS / (2 * playGrid.gridWidth);
    playGrid.rowHeight = Math.floor(playGrid.bubbleRadius * Math.sqrt(3));
    for (let h = 0; h < playGrid.gridHeight; h++) {
        const isEvenRow = (h % 2 === 0);
        const row: Row = {
            fields: [],
            size: playGrid.gridWidth - (isEvenRow ? 0 : 1),
            isEven: h % 2 === 0,
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
                    y: rowHeight * h,
                },
            };
            if (!field.bubble) {
                console.log("asdf")
            }
            row.fields.push(field)
        }
        playGrid.rows.push(row);
    }
    generateASCIIBoard();
}

export function getAllFields(): Field[] {
    const allFields: Field[] = []
    playGrid.rows.forEach(row => {
        row.fields.forEach(field => {
            allFields.push(field);
        });
    });
    return allFields;
}

function generateASCIIBoard(): void {
    let boardText = "";
    playGrid.rows.forEach(row => {
        if (!row.isEven) {
            boardText += "|.. ";
        } else {
            boardText += "| ";
        }

        row.fields.forEach(field => {
            const bubbleASCII = field.bubble ? field.bubble.ascii : "-"
            boardText += `-${bubbleASCII}- `
        });

        if (!row.isEven) {
            boardText += "..|\n";
        } else {
            boardText += "|\n";
        }
    });
    boardText += "|_________________________________|\n| . . . . . . . . . . . . . . . . |\n| . . . . . . . . . . . . . . . . |";
    boardText += `\n| . . . . . . . .${getASCIIArrow()}. . . . . . . . |\n\n`;
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