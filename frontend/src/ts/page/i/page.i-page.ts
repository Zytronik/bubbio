import { Component } from 'vue';
import { PAGE_STATE } from '../e/page.e-page-state';

export interface Page {
  title: string;
  pageState: PAGE_STATE;
  component: Component;
}