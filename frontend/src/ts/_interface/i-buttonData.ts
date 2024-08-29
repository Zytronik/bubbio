import { PAGE_STATE } from "@/ts/_constant/page.e-page-state";

export interface BackButtonData {
  iconSrc: string;
  pageState: PAGE_STATE;
  disabled: boolean;
}