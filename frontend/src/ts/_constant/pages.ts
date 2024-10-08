import type { Pages } from '../_interface/page';
import SoloMenu from '../../pages/SoloMenu.vue';
import Settings from '../../pages/Settings.vue';
import MultiMenu from '../../pages/MultiMenu.vue';
import StartMenu from '../../pages/StartMenu.vue';
import SprintPage from '../../pages/SprintPage.vue';
import ScorePage from '../../pages/ScorePage.vue';
import PixiTest from '../../pages/PixiTest.vue';

export enum PAGE {
  startMenu = 'startMenu',
  soloMenu = 'soloMenu',
  multiMenu = 'multiMenu',
  settings = 'settings',
  sprintPage = 'sprintPage',
  scorePage = 'scorePage',
  pixiTest = 'pixiTest',
}

export const pages: Pages = {
  [PAGE.startMenu]: {
    title: 'Home',
    color: 'black',
    component: StartMenu,
    allowedTransitions: [PAGE.soloMenu, PAGE.multiMenu, PAGE.settings],
  },
  [PAGE.soloMenu]: {
    title: 'Solo Menu',
    color: 'rgb(12, 167, 137)',
    component: SoloMenu,
    allowedTransitions: [
      PAGE.startMenu,
      PAGE.soloMenu,
      PAGE.multiMenu,
      PAGE.settings,
      PAGE.sprintPage,
      PAGE.scorePage,
      PAGE.pixiTest,
    ],
    backButtons: [
      {
        page: PAGE.multiMenu,
        iconSrc: require('@/assets/img/icons/multi.png'),
        disabled: true,
      },
      {
        page: PAGE.startMenu,
        iconSrc: require('@/assets/img/icons/solo.png'),
        disabled: false,
      },
      {
        page: PAGE.settings,
        iconSrc: require('@/assets/img/icons/config.png'),
        disabled: true,
      },
    ],
  },
  [PAGE.multiMenu]: {
    title: 'Multi Menu',
    color: 'rgb(218, 0, 99)',
    component: MultiMenu,
    allowedTransitions: [
      PAGE.startMenu,
      PAGE.soloMenu,
      PAGE.multiMenu,
      PAGE.settings,
    ],
    backButtons: [
      {
        page: PAGE.startMenu,
        iconSrc: require('@/assets/img/icons/multi.png'),
        disabled: false,
      },
      {
        page: PAGE.soloMenu,
        iconSrc: require('@/assets/img/icons/solo.png'),
        disabled: true,
      },
      {
        page: PAGE.settings,
        iconSrc: require('@/assets/img/icons/config.png'),
        disabled: true,
      },
    ],
  },
  [PAGE.settings]: {
    title: 'Settings',
    color: 'rgb(250, 199, 16)',
    component: Settings,
    allowedTransitions: [
      PAGE.startMenu,
      PAGE.soloMenu,
      PAGE.multiMenu,
      PAGE.settings,
    ],
    backButtons: [
      {
        page: PAGE.multiMenu,
        iconSrc: require('@/assets/img/icons/multi.png'),
        disabled: true,
      },
      {
        page: PAGE.soloMenu,
        iconSrc: require('@/assets/img/icons/solo.png'),
        disabled: true,
      },
      {
        page: PAGE.startMenu,
        iconSrc: require('@/assets/img/icons/config.png'),
        disabled: false,
      },
    ],
  },
  [PAGE.sprintPage]: {
    title: 'Sprint',
    color: 'rgb(29, 179, 157)',
    component: SprintPage,
    allowedTransitions: [
      PAGE.startMenu,
      PAGE.soloMenu,
      PAGE.scorePage,
      PAGE.pixiTest,
    ],
    backButtons: [
      {
        page: PAGE.soloMenu,
        iconSrc: require('@/assets/img/icons/sprint.png'),
        disabled: false,
      },
    ],
  },
  [PAGE.scorePage]: {
    title: 'Score',
    color: 'rgb(17, 178, 135)',
    component: ScorePage,
    allowedTransitions: [
      PAGE.startMenu,
      PAGE.soloMenu,
      PAGE.sprintPage,
      PAGE.pixiTest,
    ],
    backButtons: [
      {
        page: PAGE.sprintPage,
        iconSrc: require('@/assets/img/icons/sprint.png'),
        disabled: true,
      },
      {
        page: PAGE.soloMenu,
        iconSrc: require('@/assets/img/icons/score.png'),
        disabled: false,
      },
    ],
  },
  [PAGE.pixiTest]: {
    title: 'Pixi Testing',
    color: 'rgb(14, 122, 88)',
    component: PixiTest,
    allowedTransitions: [
      PAGE.startMenu,
      PAGE.soloMenu,
      PAGE.sprintPage,
      PAGE.scorePage,
    ],
  },
};
