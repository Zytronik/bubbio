import { Component } from 'vue';
import { PAGE_STATE } from './page.e-page-state';

export interface Page {
  title: string;
  pageState: PAGE_STATE;
  component: Component;
}