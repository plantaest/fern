import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import solid from '@solidjs/vite-plugin';
import tailwind from '@tailwindcss/vite';
import { prerender } from 'prerender-crawler/vite';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vitest/config';
import rehypeCodeBlocks from './plugins/rehype-code-blocks.ts';

export default defineConfig({
  server: { host: '127.0.0.1', port: 4321, strictPort: true },
  preview: { host: '127.0.0.1', port: 4321, strictPort: true },
  plugins: [
    {
      ...mdx({
        jsx: true,
        jsxImportSource: '@solidjs/web',
        providerImportSource: fileURLToPath(
          new URL('./src/docs/mdx-components.tsx', import.meta.url),
        ),
        elementAttributeNameCase: 'html',
        remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
        rehypePlugins: [rehypeSlug, rehypeCodeBlocks],
      }),
      enforce: 'pre',
    },
    solid({ extensions: ['.mdx'], start: true, ssr: true }),
    tailwind(),
    prerender({
      mode: 'static',
      pages: ['/', { path: '/404', filename: '404.html' }],
      failOnError: true,
    }),
  ],
  test: { environment: 'jsdom', include: ['src/**/*.test.tsx'] },
});
