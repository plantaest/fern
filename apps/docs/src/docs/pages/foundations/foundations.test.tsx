import { type JSX, render } from '@solidjs/web';
import colors from '@taxon-labs/fern/colors.json';
import { flush } from 'solid-js';
import { afterEach, expect, it } from 'vitest';
import ColorsPage from './colors.mdx';
import IconsPage from './icons.mdx';
import TypographyPage from './typography.mdx';

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  document.body.innerHTML = '';
});

function mount(view: () => JSX.Element) {
  const host = document.createElement('div');
  document.body.append(host);
  dispose = render(view, host);
  flush();

  return host;
}

it('filters color tokens and reports the number of visible results', () => {
  const host = mount(() => <ColorsPage theme="dark" />);
  const search = host.querySelector<HTMLInputElement>('#token-filter')!;
  const status = host.querySelector('.fern-docs-token-disclosure [role="status"]')!;

  search.value = 'progressive';
  search.dispatchEvent(new Event('input', { bubbles: true }));
  flush();

  const expected = Object.keys(colors.dark).filter((name) => name.includes('progressive'));
  const names = [...host.querySelectorAll('tbody td:first-child code')].map(
    (node) => node.textContent,
  );

  expect(names).toEqual(expected);
  expect(status.textContent).toBe(`${expected.length} tokens`);

  search.value = 'red-300';
  search.dispatchEvent(new Event('input', { bubbles: true }));
  flush();

  const rows = host.querySelectorAll('tbody tr');

  expect(rows).toHaveLength(1);
  expect([...rows[0].querySelectorAll('td code')].map((node) => node.textContent)).toEqual([
    'color-red-300',
    colors.dark['color-red-300'],
  ]);
  expect(status.textContent).toBe('1 token');
});

it('marks the Vietnamese reading sample with its language', () => {
  const host = mount(() => <TypographyPage />);
  const heading = host.querySelector('h3[lang="vi"]')!;
  const paragraph = heading.nextElementSibling;

  expect(heading.id).toBe('tri-thức-mở-cho-mọi-người');
  expect(paragraph?.tagName).toBe('P');
  expect(paragraph?.getAttribute('lang')).toBe('vi');
  expect(paragraph?.textContent?.trim()).toBeTruthy();
});

it('gives the icon-only example an accessible name and hides its decorative icon', () => {
  const host = mount(() => <IconsPage />);
  const button = host.querySelector('button[aria-label="Edit"]')!;

  expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
});
