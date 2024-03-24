import { PAGE_STATE } from "../e/page.e-page-state";

export interface PageTransition {
    name: string,
    origin: PAGE_STATE,
    destination: PAGE_STATE,
    transitionFunction: () => void;
}