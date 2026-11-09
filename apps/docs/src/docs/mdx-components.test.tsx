import { render } from '@solidjs/web';
import { flush } from 'solid-js';
import { expect, it, vi } from 'vitest';
import MdxFixture from './mdx-fixture.mdx';

it('opens only external Markdown links in a new tab', () => {
  const host = document.body.appendChild(document.createElement('div'));
  const dispose = render(() => <MdxFixture />, host);

  try {
    flush();

    const external = host.querySelector<HTMLAnchorElement>('a[href="https://example.org/"]')!;
    expect(external.getAttribute('target')).toBe('_blank');
    expect(external.relList.contains('noopener')).toBe(true);
    expect(external.textContent).toContain('opens in a new tab');
    expect(host.querySelectorAll('a[target]')).toHaveLength(1);
  } finally {
    dispose();
    host.remove();
  }
});

it('renders inline code and preserves unlabelled Markdown code when copied', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { clipboard: { writeText } }));
  const host = document.body.appendChild(document.createElement('div'));
  const dispose = render(() => <MdxFixture />, host);

  try {
    flush();

    const source = '  <Button>Tri thức & {label}</Button>\n';
    expect(host.querySelector('p > code')?.textContent).toBe('size="icon"');
    expect(host.querySelector('pre code')?.textContent).toBe(source);

    const copy = host.querySelector<HTMLButtonElement>('button[aria-label="Copy code"]')!;
    expect(copy.previousElementSibling?.textContent).toBe('TEXT');
    copy.click();

    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith(source));
  } finally {
    dispose();
    host.remove();
    vi.unstubAllGlobals();
  }
});
