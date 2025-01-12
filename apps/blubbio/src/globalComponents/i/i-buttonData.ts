import { PAGE_STATE } from "@/ts/page/e/page.e-page-state";

export interface BackButtonData {
  iconSrc: string;
  pageState: PAGE_STATE;
  disabled: boolean;
}