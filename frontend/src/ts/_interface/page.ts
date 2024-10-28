import type { Component } from 'vue';
import { BackButton } from './backButton';
import { PAGE } from '../_enum/page';

export interface Page {
  title: string;
  component: Component;
  color: string;
  allowedTransitions: PAGE[];
  backButtons?: BackButton[];
}

export type Pages = {
  [key in PAGE]: Page;
};
