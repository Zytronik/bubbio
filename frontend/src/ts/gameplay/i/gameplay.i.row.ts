import { Field } from "./gameplay.i.field";

export interface Row {
    fields: Field[],
    size: number,
    isEvenRow: boolean,
    isInDeathZone: boolean,
}