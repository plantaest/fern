import type { Component } from 'solid-js';
import AspectRatioPage, {
  frontmatter as aspectRatioMetadata,
} from './pages/components/aspect-ratio.mdx';
import ButtonPage, { frontmatter as buttonMetadata } from './pages/components/button.mdx';
import ButtonGroupPage, {
  frontmatter as buttonGroupMetadata,
} from './pages/components/button-group.mdx';
import MessagePage, { frontmatter as messageMetadata } from './pages/components/message.mdx';
import SeparatorPage, { frontmatter as separatorMetadata } from './pages/components/separator.mdx';
import SkeletonPage, { frontmatter as skeletonMetadata } from './pages/components/skeleton.mdx';
import ToggleButtonPage, {
  frontmatter as toggleButtonMetadata,
} from './pages/components/toggle-button.mdx';
import ToggleButtonGroupPage, {
  frontmatter as toggleButtonGroupMetadata,
} from './pages/components/toggle-button-group.mdx';
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
    path: '/components/aspect-ratio',
    group: 'Components',
    title: aspectRatioMetadata.title,
    description: aspectRatioMetadata.description,
    sections: ['Examples', 'API Reference'],
    component: AspectRatioPage,
  },
  {
    path: '/components/button',
    group: 'Components',
    title: buttonMetadata.title,
    description: buttonMetadata.description,
    sections: ['Playground', 'Examples', 'API Reference', 'Accessibility'],
    component: ButtonPage,
  },
  {
    path: '/components/button-group',
    group: 'Components',
    title: buttonGroupMetadata.title,
    description: buttonGroupMetadata.description,
    sections: ['Examples', 'API Reference', 'Accessibility'],
    component: ButtonGroupPage,
  },
  {
    path: '/components/message',
    group: 'Components',
    title: messageMetadata.title,
    description: messageMetadata.description,
    sections: ['Playground', 'API Reference', 'Accessibility'],
    component: MessagePage,
  },
  {
    path: '/components/separator',
    group: 'Components',
    title: separatorMetadata.title,
    description: separatorMetadata.description,
    sections: ['Examples', 'API Reference', 'Accessibility'],
    component: SeparatorPage,
  },
  {
    path: '/components/skeleton',
    group: 'Components',
    title: skeletonMetadata.title,
    description: skeletonMetadata.description,
    sections: ['Examples', 'API Reference', 'Accessibility'],
    component: SkeletonPage,
  },
  {
    path: '/components/toggle-button',
    group: 'Components',
    title: toggleButtonMetadata.title,
    description: toggleButtonMetadata.description,
    sections: ['Playground', 'Examples', 'API Reference', 'Accessibility'],
    component: ToggleButtonPage,
  },
  {
    path: '/components/toggle-button-group',
    group: 'Components',
    title: toggleButtonGroupMetadata.title,
    description: toggleButtonGroupMetadata.description,
    sections: ['Examples', 'API Reference', 'Accessibility'],
    component: ToggleButtonGroupPage,
  },
] as const satisfies readonly DocPage[];
