import { dynamic, type JSX } from '@solidjs/web';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconLinkExternal } from '@wikimedia/codex-icons';
import { createMemo, Show } from 'solid-js';
import { CodeBlock } from './ui';

function MarkdownLink(props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = createMemo(() => {
    const { href } = props;
    if (typeof href !== 'string' || !href) return false;

    try {
      const url = new URL(href, window.location.href);
      return /^https?:$/.test(url.protocol) && url.origin !== window.location.origin;
    } catch {
      return false;
    }
  });

  return (
    <a
      {...props}
      target={external() ? '_blank' : props.target}
      rel={external() ? [props.rel, 'noopener'].filter(Boolean).join(' ') : props.rel}
    >
      {props.children}
      <Show when={external()}>
        <Icon icon={cdxIconLinkExternal} class="ms-1 size-[0.8em]" />
        <span class="sr-only"> (opens in a new tab)</span>
      </Show>
    </a>
  );
}

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
  a: MarkdownLink,
  'code-block': CodeBlock,
};

export function useMDXComponents() {
  return components;
}
