import { render } from '@solidjs/web';
import { flush } from 'solid-js';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { App } from './app';
import { pages } from './navigation';

let dispose: (() => void) | undefined;

beforeEach(() => {
  history.replaceState(null, '', '/foundations/colors');
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

it('renders the Colors intro from frontmatter and keeps Markdown content separate', () => {
  const host = mount();
  const header = host.querySelector('main header')!;
  const content = host.querySelector('.fern-docs-content')!;

  expect(host.querySelectorAll('main h1')).toHaveLength(1);
  expect(header.querySelector('h1')?.textContent).toBe(pages[0].title);
  expect(header.querySelector('p')?.textContent).toBe(pages[0].group);
  expect(header.querySelector('p:last-child')?.textContent).toBe(pages[0].description);
  expect(content.querySelector(':scope > p')?.textContent).toBe('Roles follow the selected theme.');
});

it('keeps page metadata and navigation correct for a trailing slash', () => {
  const host = mount('/components/button/');

  expect(host.querySelector('main h1')?.textContent).toBe('Button');
  expect(document.title).toBe('Button · Fern Docs');
  expect(
    host.querySelector('nav[aria-label="Main navigation"] a[aria-current="page"]')?.textContent,
  ).toBe('Button');
  expect(host.querySelectorAll('nav[aria-label="On this page"] a')).toHaveLength(4);
});

it('navigates through a polymorphic Button while retaining native link semantics', async () => {
  const host = mount('/components/button');
  const link = host.querySelector<HTMLAnchorElement>('main a.fern-button')!;

  expect(link.textContent).toBe('Explore colors');
  expect(link.getAttribute('href')).toBe('/foundations/colors');
  expect(link.hasAttribute('role')).toBe(false);
  expect(link.hasAttribute('type')).toBe(false);

  link.click();

  await vi.waitFor(() => {
    flush();
    expect(location.pathname).toBe('/foundations/colors');
    expect(host.querySelector('main h1')?.textContent).toBe('Colors');
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

it.each([
  ['/components/button', 'accessibility'],
  ['/foundations/typography', 'tri-thức-mở-cho-mọi-người'],
  ['/foundations/colors', 'interaction-states'],
])('scrolls to the section in a direct %s URL', async (path, id) => {
  const scrollIntoView = vi.fn();
  const host = mount(`${path}#${id}`);
  host.querySelector<HTMLElement>(`#${id}`)!.scrollIntoView = scrollIntoView;

  await vi.waitFor(() => {
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
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
  host
    .querySelector<HTMLAnchorElement>(
      'nav[aria-label="On this page"] a[href="/components/button#accessibility"]',
    )!
    .click();

  await vi.waitFor(() => {
    flush();
    expect(location.hash).toBe('#accessibility');
  });

  expect(accessibility.scrollIntoView).toHaveBeenCalled();
  expect(
    host
      .querySelector('nav[aria-label="On this page"] a[href="/components/button#accessibility"]')
      ?.getAttribute('aria-current'),
  ).toBe('location');
  expect(
    host
      .querySelector('nav[aria-label="On this page"] a[href="/components/button#playground"]')
      ?.getAttribute('aria-current'),
  ).toBe('false');
  expect(host.querySelector('#button-label')).toBe(label);
  expect(label.value).toBe('Keep this label');
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

    for (const anchor of host.querySelectorAll<HTMLAnchorElement>(
      'nav[aria-label="On this page"] a',
    )) {
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
  expect(recoveryLink.textContent).toBe('Explore colors');
  expect(recoveryLink.getAttribute('href')).toBe('/foundations/colors');
  recoveryLink.click();

  await vi.waitFor(() => {
    flush();
    expect(host.querySelector('main h1')?.textContent).toBe('Colors');
    expect(document.activeElement).toBe(host.querySelector('main'));
  });

  expect(host.querySelectorAll('nav[aria-label="On this page"] a')).toHaveLength(
    pages[0].sections.length,
  );
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
