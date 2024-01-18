import { Field } from "./i/gameplay.i.field";
import { Grid } from "./i/gameplay.i.grid";
import { Row } from "./i/gameplay.i.row";

const widthUnits = 1000000;

//Gameplay Settings
const gridWidth = 8;
const gridHeight = 20;
const gridHeightExtra = 20;

const bubbleRadius = widthUnits / (2 * gridWidth);

const playGrid: Grid = {
    width: 0,
    height: 0,
    extraHeight: 0,
    rows: []
}


const emptyField: Field = {
    coords: {
        x: 0,
        y: 0
    }
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
            emptyField.coords.x = w;
            emptyField.coords.y = h;
            row.fields.push()
        }
        playGrid.rows.push(row);
    }
    console.log(playGrid);
}

// function addGarbage(): void {

// }