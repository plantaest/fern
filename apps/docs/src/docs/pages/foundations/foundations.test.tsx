import { render } from '@solidjs/web';
import colors from '@taxon-labs/fern/colors.json';
import { createSignal, flush } from 'solid-js';
import { afterEach, expect, it } from 'vitest';
import ColorsPage from './colors.mdx';
import IconsPage from './icons.mdx';
import RadiusPage from './radius.mdx';
import SpacingPage from './spacing.mdx';
import TypographyPage from './typography.mdx';

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  document.body.innerHTML = '';
});

it('passes reactive theme props through MDX and filters the official token data', () => {
  const host = document.createElement('div');
  document.body.append(host);

  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');
  dispose = render(() => <ColorsPage theme={theme()} />, host);
  flush();

  const value = () => host.querySelector('.token-value')?.textContent;
  expect(value()).toBe(colors.light['color-base']);

  setTheme('dark');
  flush();

  expect(value()).toBe(colors.dark['color-base']);

  const search = host.querySelector<HTMLInputElement>('input[type="search"]')!;

  search.value = 'progressive';
  search.dispatchEvent(new Event('input', { bubbles: true }));
  flush();

  const count = Object.keys(colors.dark).filter((name) => name.includes('progressive')).length;
  expect(host.querySelector('.token-disclosure [role="status"]')?.textContent).toBe(
    `${count} tokens`,
  );
});

it.each([
  ['Typography', TypographyPage],
  ['Spacing', SpacingPage],
  ['Radius', RadiusPage],
  ['Icons', IconsPage],
] as const)('renders the %s MDX document', (title, Page) => {
  const host = document.createElement('div');
  document.body.append(host);

  dispose = render(() => <Page />, host);
  flush();

  expect(host.querySelector('h1')?.textContent).toBe(title);
  expect(host.querySelectorAll('.doc-section').length).toBeGreaterThan(1);
});
