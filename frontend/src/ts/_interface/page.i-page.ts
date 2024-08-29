import { Component } from 'vue';
import { PAGE_STATE } from '../_constant/page.e-page-state';

export interface Page {
  title: string;
  pageState: PAGE_STATE;
  component: Component;
}