declare module '*.mdx' {
  import type { Component } from 'solid-js';

  export const frontmatter: { title: string; description: string };

  const Content: Component<{ theme?: 'light' | 'dark' }>;
  export default Content;
}
