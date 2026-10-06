import type { Component } from 'solid-js';
import ButtonPage, { frontmatter as buttonMetadata } from './pages/components/button.mdx';
import ColorsPage, { frontmatter as colorsMetadata } from './pages/foundations/colors.mdx';
import IconsPage, { frontmatter as iconsMetadata } from './pages/foundations/icons.mdx';
import RadiusPage, { frontmatter as radiusMetadata } from './pages/foundations/radius.mdx';
import SpacingPage, { frontmatter as spacingMetadata } from './pages/foundations/spacing.mdx';
import TypographyPage, {
  frontmatter as typographyMetadata,
} from './pages/foundations/typography.mdx';

export { slug as sectionId } from 'github-slugger';

export const pageGroups = ['Foundations', 'Components'] as const;

type DocPage = {
  path: string;
  group: (typeof pageGroups)[number];
  title: string;
  description: string;
  sections: readonly string[];
  component: Component<{ theme?: 'light' | 'dark' }>;
};

export const pages = [
  {
    path: '/foundations/colors',
    group: 'Foundations',
    title: colorsMetadata.title,
    description: colorsMetadata.description,
    sections: ['Roles', 'Interaction states', 'Usage', 'All tokens'],
    component: ColorsPage,
  },
  {
    path: '/foundations/typography',
    group: 'Foundations',
    title: typographyMetadata.title,
    description: typographyMetadata.description,
    sections: ['Font families', 'Scales', 'Text styles', 'Prose'],
    component: TypographyPage,
  },
  {
    path: '/foundations/spacing',
    group: 'Foundations',
    title: spacingMetadata.title,
    description: spacingMetadata.description,
    sections: ['Scale', 'In use'],
    component: SpacingPage,
  },
  {
    path: '/foundations/radius',
    group: 'Foundations',
    title: radiusMetadata.title,
    description: radiusMetadata.description,
    sections: ['Default', 'In use'],
    component: RadiusPage,
  },
  {
    path: '/foundations/icons',
    group: 'Foundations',
    title: iconsMetadata.title,
    description: iconsMetadata.description,
    sections: ['Gallery', 'In use'],
    component: IconsPage,
  },
  {
    path: '/components/button',
    group: 'Components',
    title: buttonMetadata.title,
    description: buttonMetadata.description,
    sections: ['API Reference', 'Playground', 'Examples', 'Accessibility'],
    component: ButtonPage,
  },
] as const satisfies readonly DocPage[];
