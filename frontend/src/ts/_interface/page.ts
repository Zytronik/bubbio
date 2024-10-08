import type { Component } from 'vue';
import type { PAGE } from '../_constant/pages';
import { BackButton } from './backButton';

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
