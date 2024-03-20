import { Ref } from "vue";

export interface NumberSetting {
    name: string,
    description: string,
    refNumber: Ref<number>,
    defaultValue: number,
    min: number,
    max: number,
}