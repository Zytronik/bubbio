import { Field } from "./i/gameplay.i.field";
import { Grid } from "./i/gameplay.i.grid";
import { Row } from "./i/gameplay.i.row";
import { GRID_EXTRA_HEIGHT, GRID_HEIGHT, GRID_WIDTH } from "../game-settings/game-settings.game";
import { Coordinates } from "./i/gameplay.i.grid-coordinates";

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
    const WIDTH_UNITS = 100000000;
    playGrid.visualWidth = WIDTH_UNITS;
    playGrid.gridWidth = GRID_WIDTH.value;
    playGrid.bubbleRadius = WIDTH_UNITS / (2 * playGrid.gridWidth);
    playGrid.collisionRangeSquared = (playGrid.bubbleRadius * 2) ** 2;
    playGrid.rowHeight = Math.floor(playGrid.bubbleRadius * Math.sqrt(3));
    playGrid.visualHeight = playGrid.rowHeight * (GRID_HEIGHT.value + GRID_EXTRA_HEIGHT.value);
    playGrid.gridHeight = GRID_HEIGHT.value;
    playGrid.extraGridHeight = GRID_EXTRA_HEIGHT.value;
    playGrid.bubbleLauncherPosition = { x: WIDTH_UNITS / 2, y: playGrid.visualHeight - playGrid.bubbleRadius };
    playGrid.rows = [];
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
}

export function getNearbyFields(pointPosition: Coordinates): Field[] {
    const bubbleRadius = playGrid.bubbleRadius;
    const bubbleDiameter = playGrid.bubbleRadius * 2;
    const h = Math.round((pointPosition.y - bubbleRadius) / playGrid.rowHeight);
    const isEvenRow = playGrid.rows[h].isEven;
    const xOffSet = (isEvenRow ? bubbleRadius : bubbleDiameter)
    const w = Math.round((pointPosition.x - xOffSet) / bubbleDiameter);

    const nearbyFields: Field[] = []
    for (let row = h - 2; row < h + 2; row++) {
        for (let column = w - 2; column < w + 2; column++) {
            if (playGrid.rows[row] && playGrid.rows[row].fields[column]) {
                nearbyFields.push(playGrid.rows[row].fields[column]);
            }
        }
    }
    return nearbyFields;
}

export function dissolveBubbles(collidedAtField: Field): void {
    const komma = ','
    const x = collidedAtField.coords.x;
    const y = collidedAtField.coords.y;
    const colorToCheck = collidedAtField.bubble!.type;
    const visited = new Set<string>();
    const result = new Set<string>();
    findAdjacentBubbles(x, y, colorToCheck, visited, result);
    console.log(result)
    if (result.size >= 3) {
        result.forEach(xyString => {
            const x = parseInt(xyString.split(komma)[0]);
            const y = parseInt(xyString.split(komma)[1]);
            getField(x, y).bubble = undefined;
        })
    }

    function findAdjacentBubbles(x: number, y: number, colorToCheck: number, visited: Set<string>, result: Set<string>) {
        if (visited.has(`${x}${komma}${y}`) || !playGrid.rows[y] || !playGrid.rows[y].fields[x]) {
            return;
        }
        visited.add(`${x}${komma}${y}`);

        const field = getField(x, y);
        if (!field.bubble || field.bubble.type !== colorToCheck) {
            return;
        }

        result.add(`${x}${komma}${y}`);

        findAdjacentBubbles(x - 1, y, colorToCheck, visited, result);
        findAdjacentBubbles(x + 1, y, colorToCheck, visited, result);
        findAdjacentBubbles(x, y - 1, colorToCheck, visited, result);
        findAdjacentBubbles(x, y + 1, colorToCheck, visited, result);
    }

    function getField(x: number, y: number): Field {
        return playGrid.rows[y].fields[x]
    }
}


// function addGarbage(): void {

// }