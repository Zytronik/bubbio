import { Ref } from "vue";

export interface BooleanSetting {
    name: string,
    description: string,
    refBoolean: Ref<boolean>,
    defaultValue: boolean,
}