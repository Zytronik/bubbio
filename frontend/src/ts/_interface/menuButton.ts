import { PAGE } from '../_constant/pages';

export interface MenuButton {
  iconSrc: string;
  title: string;
  desc: string;
  page: PAGE;
  bigButton: boolean;
  authIds?: number[];
}
