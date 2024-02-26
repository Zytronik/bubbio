import { Ref } from "vue";

export interface BooleanSetting {
    name: string,
    description: string,
    value: boolean,
    refValue: Ref<boolean>,
    defaultValue: boolean,
}