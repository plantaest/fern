import type { Component } from 'solid-js';
import ButtonPage from './pages/components/button.mdx';
import ColorsPage from './pages/foundations/colors.mdx';
import IconsPage from './pages/foundations/icons.mdx';
import RadiusPage from './pages/foundations/radius.mdx';
import SpacingPage from './pages/foundations/spacing.mdx';
import TypographyPage from './pages/foundations/typography.mdx';

export const pageGroups = ['Foundations', 'Components'] as const;

type DocPage = {
  path: string;
  title: string;
  group: (typeof pageGroups)[number];
  sections: readonly string[];
  component: Component<{ theme?: 'light' | 'dark' }>;
};

export const pages = [
  {
    path: '/foundations/colors',
    title: 'Colors',
    component: ColorsPage,
    group: 'Foundations',
    sections: ['Roles', 'Interaction states', 'All tokens'],
  },
  {
    path: '/foundations/typography',
    title: 'Typography',
    component: TypographyPage,
    group: 'Foundations',
    sections: ['Type scale', 'Reading sample', 'Vietnamese', 'Code'],
  },
  {
    path: '/foundations/spacing',
    title: 'Spacing',
    component: SpacingPage,
    group: 'Foundations',
    sections: ['Scale', 'In use'],
  },
  {
    path: '/foundations/radius',
    title: 'Radius',
    component: RadiusPage,
    group: 'Foundations',
    sections: ['Default', 'In use'],
  },
  {
    path: '/foundations/icons',
    title: 'Icons',
    component: IconsPage,
    group: 'Foundations',
    sections: ['Gallery', 'In use'],
  },
  {
    path: '/components/button',
    title: 'Button',
    component: ButtonPage,
    group: 'Components',
    sections: ['API Reference', 'Playground', 'Examples', 'Accessibility'],
  },
] as const satisfies readonly DocPage[];
