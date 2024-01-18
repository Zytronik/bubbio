import { Ref, ref } from "vue";
import { Field } from "./i/gameplay.i.field";
import { Grid } from "./i/gameplay.i.grid";
import { Row } from "./i/gameplay.i.row";
import { Bubble } from "./i/gameplay.i.bubble";
import { getRandomBubble } from "./gameplay.bubble-manager";
import { angle } from "./gameplay.angle";

const widthUnits = 1000000;

//Gameplay Settings
const gridWidth = 8;
const gridHeight = 20;
const gridHeightExtra = 20;

const bubbleRadius = widthUnits / (2 * gridWidth);

export const playGridASCII: Ref<string> = ref("");
const playGrid: Grid = {
    width: 0,
    height: 0,
    extraHeight: 0,
    rows: []
}

export function setupGrid(): void {
    playGrid.width = gridWidth;
    playGrid.height = gridHeight;
    playGrid.extraHeight = gridHeightExtra;
    for (let h = 0; h < playGrid.height; h++) {
        const row: Row = {
            fields: [],
            size: playGrid.width - ((h % 2 === 0) ? 0 : 1),
            isEven: h % 2 === 0,
        }
        for (let w = 0; w < row.size; w++) {
            const field: Field = {
                coords: {
                    x: w,
                    y: h,
                },
            };
            row.fields.push(field)
        }
        playGrid.rows.push(row);
    }
    generateASCIIBoard();
}

function generateASCIIBoard(): void {
    playGrid.rows.forEach(row => {
        if (!row.isEven) {
            playGridASCII.value += "|.. ";
        } else {
            playGridASCII.value += "| ";
        }

        row.fields.forEach(field => {
            const bubbleASCII = field.bubble ? field.bubble.ascii : "-"
            playGridASCII.value += `-${bubbleASCII}- `
        });

        if (!row.isEven) {
            playGridASCII.value += "..|\n";
        } else {
            playGridASCII.value += "|\n";
        }
    });
    playGridASCII.value += "|_________________________________|\n| . . . . . . . . . . . . . . . . |\n| . . . . . . . . . . . . . . . . |";
    playGridASCII.value += `\n| . . . . . . . .${getASCIIArrow()}. . . . . . . . |\n\n`;
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

function shootBubble(): void {
    const nextBubble: Bubble = getRandomBubble();

}

// function addGarbage(): void {
    // ↖ ↑ ↗
    // ← · →
// }