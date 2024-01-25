import { Component } from 'vue';
import { PageState } from './page.e-page-state';

export interface Page {
  title: string;
  pageState: PageState;
  component: Component;
}