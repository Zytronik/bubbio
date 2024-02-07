import { Field } from "./i/gameplay.i.field";
import { Grid } from "./i/gameplay.i.grid";
import { Row } from "./i/gameplay.i.row";
import { GRID_EXTRA_HEIGHT, GRID_HEIGHT, GRID_WIDTH } from "../game-settings/game-settings.game";
import { Coordinates } from "./i/gameplay.i.grid-coordinates";

const playGrid: Grid = {
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
    const WIDTH_UNITS = 10000000;
    playGrid.visualWidth = WIDTH_UNITS;
    playGrid.gridWidth = GRID_WIDTH.value;
    playGrid.bubbleRadius = WIDTH_UNITS / (2 * playGrid.gridWidth);
    playGrid.collisionRangeSquared = ((playGrid.bubbleRadius * 2) ** 2) * 0.3;
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
            isEvenRow: h % 2 === 0,
            isInDeathZone: h >= playGrid.gridHeight,
        }
        for (let w = 0; w < row.size; w++) {
            const bubbleRadius = playGrid.bubbleRadius
            const bubbleDiameter = playGrid.bubbleRadius * 2;
            const rowHeight = playGrid.rowHeight;
            const field: Field = {
                coords: { x: w, y: h, },
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
    const row = Math.round((pointPosition.y - bubbleRadius) / playGrid.rowHeight);
    const isEvenRow = playGrid.rows[row].isEvenRow;
    const xOffSet = (isEvenRow ? bubbleRadius : bubbleDiameter)
    const column = Math.round((pointPosition.x - xOffSet) / bubbleDiameter);
    const nearbyFields: Field[] = []
    getAdjacentFieldVectors({ x: column, y: row }).forEach(fieldVector => {
        const x = column + fieldVector.x;
        const y = row + fieldVector.y;
        if (playGrid.rows[y] && playGrid.rows[y].fields[x]) {
            nearbyFields.push(playGrid.rows[y].fields[x]);
        }
    })
    return nearbyFields;
}

export function dissolveBubbles(collidedAtField: Field): number {
    let dissolvedBubblesAmount = 0;
    const komma = ','
    const x = collidedAtField.coords.x;
    const y = collidedAtField.coords.y;
    const colorToCheck = collidedAtField.bubble!.type;
    const visited = new Set<string>();
    const result = new Set<string>();
    findAdjacentBubbles(x, y, colorToCheck, visited, result);
    if (result.size >= 3) {
        result.forEach(xyString => {
            const x = parseInt(xyString.split(komma)[0]);
            const y = parseInt(xyString.split(komma)[1]);
            getField(x, y).bubble = undefined;
        })
        dissolvedBubblesAmount += result.size;
    }
    const unconnected = getFreeFloatingBubbles();
    console.log(unconnected)
    unconnected.forEach(xyString => {
        const x = parseInt(xyString.split(komma)[0]);
        const y = parseInt(xyString.split(komma)[1]);
        getField(x, y).bubble = undefined;
        dissolvedBubblesAmount++;
    })
    return dissolvedBubblesAmount;

    function findAdjacentBubbles(x: number, y: number, colorToCheck: number, visited: Set<string>, result: Set<string>): void {
        const isInBounds = playGrid.rows[y] != undefined && playGrid.rows[y].fields[x] != undefined;
        const alreadyTraversed = visited.has(`${x}${komma}${y}`);
        if (alreadyTraversed || !isInBounds) {
            return;
        }
        visited.add(`${x}${komma}${y}`);

        const field = getField(x, y);
        if (!field.bubble || field.bubble.type !== colorToCheck) {
            return;
        }

        result.add(`${x}${komma}${y}`);

        getAdjacentFieldVectors({ x: x, y: y }).forEach(fieldVector => {
            const nextX = x + fieldVector.x;
            const nextY = y + fieldVector.y;
            findAdjacentBubbles(nextX, nextY, colorToCheck, visited, result);
        });
    }

    function getFreeFloatingBubbles(): Set<string> {
        const connected = new Set<string>();
        const unconnected = new Set<string>();
        playGrid.rows[0].fields.forEach(firstRowField => {
            findBubblesConnectoToTop(firstRowField.coords.x, firstRowField.coords.y, connected);
        });

        playGrid.rows.forEach(row => {
            row.fields.forEach(field => {
                const xyString = `${field.coords.x}${komma}${field.coords.y}`;
                if (!connected.has(xyString) && field.bubble) {
                    unconnected.add(xyString);
                }
            });
        });
        return unconnected;

        function findBubblesConnectoToTop(x: number, y: number, connected: Set<string>): void {
            const isInBounds = playGrid.rows[y] != undefined && playGrid.rows[y].fields[x] != undefined;
            const alreadyTraversed = connected.has(`${x}${komma}${y}`);
            if (!isInBounds || !playGrid.rows[y].fields[x].bubble || alreadyTraversed) {
                return;
            }

            connected.add(`${x}${komma}${y}`);

            getAdjacentFieldVectors({ x: x, y: y }).forEach(fieldVector => {
                const nextX = x + fieldVector.x;
                const nextY = y + fieldVector.y;
                findBubblesConnectoToTop(nextX, nextY, connected);
            });
        }
    }

    function getField(x: number, y: number): Field {
        return playGrid.rows[y].fields[x]
    }
}

function getAdjacentFieldVectors(gridPosition: Coordinates): Coordinates[] {
    const hexagonalShift = playGrid.rows[gridPosition.y].isEvenRow ? -1 : 1;
    const adjacentFieldVectors: Coordinates[] = [
        { x: 0, y: 0, },
        { x: -1, y: 0, },
        { x: 1, y: 0, },
        { x: hexagonalShift, y: -1, },
        { x: hexagonalShift, y: 1, },
        { x: 0, y: -1, },
        { x: 0, y: +1, },
    ]
    return adjacentFieldVectors;
}

// function addGarbage(): void {

// }

export function getPlayGridRows(): Row[] {
    return playGrid.rows;
}

export function getBubbleRadius(): number {
    return playGrid.bubbleRadius;
}

export function getBubbleLauncherPosition(): Coordinates {
    return playGrid.bubbleLauncherPosition;
}

export function getVisualWidth(): number {
    return playGrid.visualWidth;
}

export function getVisualHeight(): number {
    return playGrid.visualHeight;
}

export function getCollisionRangeSquared(): number {
    return playGrid.collisionRangeSquared;
}

