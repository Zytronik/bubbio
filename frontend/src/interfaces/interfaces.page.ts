import { DefineComponent } from "vue";

export interface Page {
    name: string;
    component: DefineComponent<{}, {}, any>;
}