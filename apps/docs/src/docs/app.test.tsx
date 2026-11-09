import { render } from '@solidjs/web';
import { flush } from 'solid-js';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { App } from './app';
import { pages } from './navigation';

let dispose: (() => void) | undefined;

beforeEach(() => {
  localStorage.clear();

  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    return window.setTimeout(() => callback(performance.now()), 0);
  });
  vi.stubGlobal('cancelAnimationFrame', (frame: number) => window.clearTimeout(frame));
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  dispose?.();
  document.body.innerHTML = '';
  localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function mount(path = '/foundations/colors') {
  history.replaceState(null, '', path);
  const host = document.createElement('div');
  document.body.append(host);
  dispose = render(() => <App />, host);
  flush();

  return host;
}

it('keeps navigation correct for a trailing slash', () => {
  const host = mount('/components/button/');

  expect(
    host.querySelector('nav[aria-label="Main navigation"] a[aria-current="page"]')?.textContent,
  ).toBe('Button');
  expect(host.querySelectorAll('nav[aria-label="On this page"] a')).toHaveLength(4);
});

it('navigates through a polymorphic Button and focuses main', async () => {
  const host = mount('/components/button');
  host.querySelector<HTMLAnchorElement>('main a.fern-button')!.click();

  await vi.waitFor(() => {
    flush();
    expect(location.pathname).toBe('/foundations/colors');
    expect(document.activeElement).toBe(host.querySelector('main'));
  });
});

it('redirects the home URL without adding a history entry', async () => {
  const length = history.length;
  const host = mount('/');

  await vi.waitFor(() => {
    flush();
    expect(location.pathname).toBe('/foundations/colors');
    expect(host.querySelector('main h1')?.textContent).toBe('Colors');
  });

  expect(location.hash).toBe('');
  expect(history.length).toBe(length);
});

it('scrolls to a Vietnamese heading in a direct fragment URL', async () => {
  const id = 'tri-thức-mở-cho-mọi-người';
  const host = mount(`/foundations/typography#${id}`);
  const heading = host.querySelector<HTMLElement>(`#${id}`)!;
  heading.scrollIntoView = vi.fn();

  await vi.waitFor(() => {
    expect(heading.scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
  });
});

it('keeps the playground mounted when navigating to a section', async () => {
  const host = mount('/components/button');
  const label = host.querySelector<HTMLInputElement>('#button-label')!;

  label.value = 'Keep this label';
  label.dispatchEvent(new Event('input', { bubbles: true }));
  flush();

  const accessibility = host.querySelector<HTMLElement>('#accessibility')!;
  accessibility.scrollIntoView = vi.fn();
  const link = host.querySelector<HTMLAnchorElement>(
    'nav[aria-label="On this page"] a[href="/components/button#accessibility"]',
  )!;
  link.click();

  await vi.waitFor(() => {
    flush();
    expect(link.getAttribute('aria-current')).toBe('location');
    expect(accessibility.scrollIntoView).toHaveBeenCalled();
  });

  expect(host.querySelector<HTMLInputElement>('#button-label')?.value).toBe('Keep this label');
});

it('moves skip-link focus to main', async () => {
  const host = mount('/components/button');
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
    const link = host.querySelector<HTMLAnchorElement>(
      `nav[aria-label="Main navigation"] a[href="${page.path}"]`,
    )!;
    link.click();

    await vi.waitFor(() => {
      flush();
      expect(host.querySelector('main h1')?.textContent).toBe(page.title);
    });

    expect(location.pathname).toBe(page.path);
    expect(document.title).toBe(`${page.title} · Fern Docs`);
    expect(host.querySelectorAll('main h1')).toHaveLength(1);
    expect(host.querySelector('main header p')?.textContent).toBe(page.group);
    expect(host.querySelector('main header p:last-child')?.textContent).toBe(page.description);
    expect(link.getAttribute('aria-current')).toBe('page');
    expect([...host.querySelectorAll('main h2')].map((node) => node.textContent)).toEqual(
      page.sections,
    );

    const sections = host.querySelectorAll<HTMLAnchorElement>('nav[aria-label="On this page"] a');
    expect([...sections].map((anchor) => anchor.textContent)).toEqual(page.sections);

    for (const anchor of sections) {
      const id = decodeURIComponent(anchor.hash.slice(1));
      const target = document.getElementById(id);
      expect(target?.tagName).toBe('H2');
      expect(target?.textContent).toBe(anchor.textContent);
    }
  }
});

it('renders a missing page and recovers through its native link', async () => {
  const host = mount('/missing-page');

  await vi.waitFor(() => {
    flush();
    expect(host.querySelector('main h1')?.textContent).toBe('Page not found');
  });

  expect(document.title).toBe('Page not found · Fern Docs');
  expect(host.querySelector('nav[aria-label="On this page"]')).toBeNull();

  const recoveryLink = host.querySelector<HTMLAnchorElement>('main a')!;
  recoveryLink.click();

  await vi.waitFor(() => {
    flush();
    expect(host.querySelector('main h1')?.textContent).toBe('Colors');
  });
});

it('supports browser Back and Forward navigation', async () => {
  const host = mount('/components/button');
  host
    .querySelector<HTMLAnchorElement>(
      'nav[aria-label="Main navigation"] a[href="/foundations/colors"]',
    )!
    .click();

  await vi.waitFor(() => {
    flush();
    expect(host.querySelector('main h1')?.textContent).toBe('Colors');
  });

  history.back();

  await vi.waitFor(() => {
    flush();
    expect(location.pathname).toBe('/components/button');
    expect(host.querySelector('main h1')?.textContent).toBe('Button');
  });

  history.forward();

  await vi.waitFor(() => {
    flush();
    expect(location.pathname).toBe('/foundations/colors');
    expect(host.querySelector('main h1')?.textContent).toBe('Colors');
  });
});
