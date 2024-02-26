import { Ref } from "vue";

export interface NumberSetting {
    name: string,
    description: string,
    value: number,
    refValue: Ref<number>,
    defaultValue: number,
    min: number,
    max: number,
}