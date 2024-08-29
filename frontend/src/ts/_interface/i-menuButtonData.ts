import { PAGE_STATE } from "@/ts/_constant/page.e-page-state";

export interface MenuButtonData {
  iconSrc: string;
  title: string;
  desc: string;
  pageState: PAGE_STATE;
  bigButton: boolean;
  authIds?: string[];
}