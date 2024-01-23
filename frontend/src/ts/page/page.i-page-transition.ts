import { PageState } from "./page.e-page-state";

export interface PageTransition {
    name: string,
    origin: PageState,
    destination: PageState,
    transitionFunction: () => void;
}