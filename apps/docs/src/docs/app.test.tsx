import { render } from '@solidjs/web';
import colors from '@taxon-labs/fern/colors.json';
import { flush } from 'solid-js';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { App } from './app';
import { pages } from './navigation';

let dispose: (() => void) | undefined;

beforeEach(() => {
  history.replaceState(null, '', '/foundations/colors');
  localStorage.clear();

  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  dispose?.();
  document.body.innerHTML = '';
  localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function mount() {
  const host = document.createElement('div');
  document.body.append(host);
  dispose = render(() => <App />, host);
  flush();

  return host;
}

it('keeps page metadata and navigation correct for a trailing slash', () => {
  history.replaceState(null, '', '/components/button/');
  const host = mount();

  expect(host.querySelector('main h1')?.textContent).toBe('Button');
  expect(document.title).toBe('Button · Fern Docs');
  expect(host.querySelector('.sidebar a[aria-current="page"]')?.textContent).toBe('Button');
  expect(host.querySelectorAll('.toc a')).toHaveLength(4);
});

it('redirects the home URL without adding a history entry', async () => {
  history.replaceState(null, '', '/');
  const length = history.length;
  const host = mount();

  await vi.waitFor(() => {
    flush();
    expect(location.pathname).toBe('/foundations/colors');
    expect(host.querySelector('main h1')?.textContent).toBe('Colors');
  });

  expect(location.hash).toBe('');
  expect(history.length).toBe(length);
});

it('scrolls to the section in a direct page URL', async () => {
  history.replaceState(null, '', '/components/button#accessibility');

  const scrollIntoView = vi.fn();
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    queueMicrotask(() => callback(0));
    return 0;
  });

  const host = mount();
  host.querySelector<HTMLElement>('#accessibility')!.scrollIntoView = scrollIntoView;

  await vi.waitFor(() => {
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
  });
});

it('keeps the playground mounted for section links and moves skip-link focus to main', async () => {
  history.replaceState(null, '', '/components/button');
  const host = mount();
  const label = host.querySelector<HTMLInputElement>('#button-label')!;

  label.value = 'Keep this label';
  label.dispatchEvent(new Event('input', { bubbles: true }));
  flush();

  const accessibility = host.querySelector<HTMLElement>('#accessibility')!;
  accessibility.scrollIntoView = vi.fn();
  host.querySelector<HTMLAnchorElement>('.toc a[href="/components/button#accessibility"]')!.click();

  await vi.waitFor(() => {
    flush();
    expect(location.hash).toBe('#accessibility');
  });

  expect(accessibility.scrollIntoView).toHaveBeenCalled();
  expect(
    host
      .querySelector('.toc a[href="/components/button#accessibility"]')
      ?.getAttribute('aria-current'),
  ).toBe('location');
  expect(
    host
      .querySelector('.toc a[href="/components/button#playground"]')
      ?.getAttribute('aria-current'),
  ).toBe('false');
  expect(host.querySelector('#button-label')).toBe(label);
  expect(label.value).toBe('Keep this label');

  const main = host.querySelector('main')!;
  main.scrollIntoView = vi.fn();
  host.querySelector<HTMLAnchorElement>('a[href="/components/button#main"]')!.click();

  await vi.waitFor(() => {
    flush();
    expect(location.hash).toBe('#main');
    expect(document.activeElement).toBe(main);
  });
});

it('opens every configured page and links its table of contents to rendered sections', async () => {
  const host = mount();

  for (const page of pages) {
    const link = host.querySelector<HTMLAnchorElement>(`.sidebar a[href="${page.path}"]`)!;
    link.click();

    await vi.waitFor(() => {
      flush();
      expect(host.querySelector('main h1')?.textContent).toBe(page.title);
    });

    expect(location.pathname).toBe(page.path);
    expect(document.title).toBe(`${page.title} · Fern Docs`);
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(
      [...host.querySelectorAll('main .doc-section h2')].map((node) => node.textContent),
    ).toEqual(page.sections);

    for (const anchor of host.querySelectorAll<HTMLAnchorElement>('.toc a')) {
      const id = anchor.hash.slice(1);
      expect(document.getElementById(id)?.querySelector('h2')?.textContent).toBe(
        anchor.textContent,
      );
    }
  }

  history.pushState(null, '', '/missing-page');
  window.dispatchEvent(new PopStateEvent('popstate'));

  await vi.waitFor(() => {
    flush();
    expect(host.querySelector('main h1')?.textContent).toBe('Page not found');
  });

  expect(document.title).toBe('Page not found · Fern Docs');
  expect(host.querySelector('.toc')).toBeNull();

  const recoveryLink = host.querySelector<HTMLAnchorElement>('main a')!;
  expect(recoveryLink.textContent).toBe('Explore colors');
  expect(recoveryLink.getAttribute('href')).toBe('/foundations/colors');
  recoveryLink.click();

  await vi.waitFor(() => {
    flush();
    expect(host.querySelector('main h1')?.textContent).toBe('Colors');
  });

  expect(document.activeElement).toBe(host.querySelector('main'));
  expect(host.querySelectorAll('.toc a')).toHaveLength(pages[0].sections.length);
});

it('preserves the playground on theme changes and supports mobile navigation and history', async () => {
  history.replaceState(null, '', '/components/button');
  const host = mount();
  const variant = host.querySelector<HTMLSelectElement>('.playground select')!;
  const label = host.querySelector<HTMLInputElement>('.playground input')!;

  variant.value = 'outline';
  variant.dispatchEvent(new Event('change', { bubbles: true }));
  label.value = 'Publish draft';
  label.dispatchEvent(new Event('input', { bubbles: true }));
  host.querySelectorAll<HTMLButtonElement>('.theme-switch button')[1].click();
  flush();

  expect(host.querySelector('.fern-docs')?.getAttribute('data-theme')).toBe('dark');
  expect(host.querySelector('main h1')?.textContent).toBe('Button');
  expect(host.querySelector('.playground select')).toBe(variant);
  expect(host.querySelector('.playground input')).toBe(label);
  expect(host.querySelector('.playground button')?.textContent?.trim()).toBe('Publish draft');
  expect(host.querySelector('.playground code')?.textContent).toBe(
    '<Button variant="outline">\n  Publish draft\n</Button>',
  );
  expect(localStorage.getItem('fern-docs-theme')).toBe('dark');

  host.querySelector<HTMLButtonElement>('.menu-toggle')!.click();
  flush();
  host
    .querySelector<HTMLAnchorElement>('.mobile-navigation a[href="/foundations/colors"]')!
    .click();

  await vi.waitFor(() => {
    flush();
    expect(host.querySelector('main h1')?.textContent).toBe('Colors');
  });

  expect(host.querySelector('.mobile-navigation')).toBeNull();
  expect(host.querySelector('.token-value')?.textContent).toBe(colors.dark['color-base']);

  host.querySelectorAll<HTMLButtonElement>('.theme-switch button')[0].click();
  flush();
  expect(host.querySelector('.token-value')?.textContent).toBe(colors.light['color-base']);

  history.back();

  await vi.waitFor(() => {
    flush();
    expect(host.querySelector('main h1')?.textContent).toBe('Button');
  });

  history.forward();

  await vi.waitFor(() => {
    flush();
    expect(host.querySelector('main h1')?.textContent).toBe('Colors');
  });
});
