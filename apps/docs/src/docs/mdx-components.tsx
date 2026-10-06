import { dynamic } from '@solidjs/web';
import { CodeBlock } from './ui';

// MDX resolves Markdown elements through component names. Solid needs those
// names to be functions rather than strings such as "p" or "ul".
const tags = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'a',
  'strong',
  'em',
  'code',
  'pre',
  'blockquote',
  'hr',
  'br',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'del',
];

const components = {
  ...Object.fromEntries(tags.map((tag) => [tag, dynamic(() => tag, { static: true })])),
  'code-block': CodeBlock,
};

export function useMDXComponents() {
  return components;
}
