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
  title: string;
  description: string;
  group: (typeof pageGroups)[number];
  sections: readonly string[];
  component: Component<{ theme?: 'light' | 'dark' }>;
};

export const pages = [
  {
    path: '/foundations/colors',
    title: colorsMetadata.title,
    description: colorsMetadata.description,
    component: ColorsPage,
    group: 'Foundations',
    sections: ['Roles', 'Interaction states', 'Usage', 'All tokens'],
  },
  {
    path: '/foundations/typography',
    title: typographyMetadata.title,
    description: typographyMetadata.description,
    component: TypographyPage,
    group: 'Foundations',
    sections: ['Font families', 'Scales', 'Text styles', 'Prose'],
  },
  {
    path: '/foundations/spacing',
    title: spacingMetadata.title,
    description: spacingMetadata.description,
    component: SpacingPage,
    group: 'Foundations',
    sections: ['Scale', 'In use'],
  },
  {
    path: '/foundations/radius',
    title: radiusMetadata.title,
    description: radiusMetadata.description,
    component: RadiusPage,
    group: 'Foundations',
    sections: ['Default', 'In use'],
  },
  {
    path: '/foundations/icons',
    title: iconsMetadata.title,
    description: iconsMetadata.description,
    component: IconsPage,
    group: 'Foundations',
    sections: ['Gallery', 'In use'],
  },
  {
    path: '/components/button',
    title: buttonMetadata.title,
    description: buttonMetadata.description,
    component: ButtonPage,
    group: 'Components',
    sections: ['API Reference', 'Playground', 'Examples', 'Accessibility'],
  },
] as const satisfies readonly DocPage[];
