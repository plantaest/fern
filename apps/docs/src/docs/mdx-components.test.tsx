import { render } from '@solidjs/web';
import { flush } from 'solid-js';
import { afterEach, expect, it, vi } from 'vitest';
import MdxFixture from './mdx-fixture.mdx';
import { sectionId } from './navigation';

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

function mount() {
  const host = document.createElement('div');
  document.body.append(host);
  dispose = render(() => <MdxFixture />, host);
  flush();

  return host;
}

it('renders Markdown code blocks with language labels while keeping inline code inline', () => {
  const host = mount();

  expect(host.querySelector('p > code')?.textContent).toBe('size="icon"');
  expect(host.querySelector('pre pre')).toBeNull();
  expect(host.querySelectorAll('button[aria-label="Copy code"]')).toHaveLength(2);
  expect(host.querySelector('pre code.language-css')?.textContent).toBe(
    '.fern-button {\n  border-radius: 0.25rem;\n}',
  );
  expect(host.querySelector('pre code.language-text')?.textContent).toBe(
    '  <Button>Tri thức & {label}</Button>\n',
  );
  expect(
    [...host.querySelectorAll('pre')].map(
      (pre) => pre.previousElementSibling?.querySelector('span')?.textContent,
    ),
  ).toEqual(['CSS', 'TEXT']);
});

it('matches navigation IDs to Markdown headings with punctuation and Vietnamese text', () => {
  const host = mount();
  const headings = [...host.querySelectorAll('h2')];

  expect(headings.map((heading) => heading.id)).toEqual(['what-is-fern', 'api--usage', 'tri-thức']);

  for (const heading of headings) {
    expect(sectionId(heading.textContent ?? '')).toBe(heading.id);
  }
});

it('copies the original Markdown code including indentation and trailing blank lines', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { clipboard: { writeText } }));

  const host = mount();
  const copy = host.querySelectorAll<HTMLButtonElement>('button[aria-label="Copy code"]')[1];
  copy.click();

  await vi.waitFor(() => {
    expect(writeText).toHaveBeenCalledWith('  <Button>Tri thức & {label}</Button>\n');
  });
});
