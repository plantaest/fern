import { render } from '@solidjs/web';
import colors from '@taxonlabs/fern/colors.json';
import { flush } from 'solid-js';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { App } from '../app';

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

it('restores the saved theme and keeps both theme buttons in sync', () => {
  localStorage.setItem('fern-docs-theme', 'dark');
  const host = mount();
  const light = host.querySelector<HTMLButtonElement>('button[aria-label="Light"]')!;
  const dark = host.querySelector<HTMLButtonElement>('button[aria-label="Dark"]')!;

  expect(host.querySelector('.fern-docs')?.getAttribute('data-theme')).toBe('dark');
  expect(dark.getAttribute('aria-pressed')).toBe('true');
  expect(host.querySelector('.token-value')?.textContent).toBe(colors.dark['color-base']);

  light.click();
  flush();

  expect(host.querySelector('.fern-docs')?.getAttribute('data-theme')).toBe('light');
  expect(light.getAttribute('aria-pressed')).toBe('true');
  expect(dark.getAttribute('aria-pressed')).toBe('false');
  expect(host.querySelector('.token-value')?.textContent).toBe(colors.light['color-base']);
  expect(localStorage.getItem('fern-docs-theme')).toBe('light');
});

it('allows theme changes when browser storage is unavailable', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('Storage unavailable');
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Storage unavailable');
  });
  const host = mount();

  expect(host.querySelector('.fern-docs')?.getAttribute('data-theme')).toBe('light');

  host.querySelector<HTMLButtonElement>('button[aria-label="Dark"]')!.click();
  flush();

  expect(host.querySelector('.fern-docs')?.getAttribute('data-theme')).toBe('dark');
});

it('keeps the playground mounted when changing theme', () => {
  const host = mount('/components/button');
  const label = host.querySelector<HTMLInputElement>('#button-label')!;

  label.value = 'Publish draft';
  label.dispatchEvent(new Event('input', { bubbles: true }));
  host.querySelector<HTMLButtonElement>('button[aria-label="Dark"]')!.click();
  flush();

  expect(host.querySelector<HTMLInputElement>('#button-label')?.value).toBe('Publish draft');
  expect(host.querySelector('.playground button')?.textContent?.trim()).toBe('Publish draft');
});

it.each(['/foundations/colors', '/components/button'])(
  'closes mobile navigation after selecting %s',
  async (path) => {
    const host = mount('/components/button');
    const menu = host.querySelector<HTMLDialogElement>('#mobile-navigation')!;
    Object.assign(menu, {
      showModal: () => {
        menu.open = true;
      },
      close: () => {
        menu.open = false;
      },
    });

    host.querySelector<HTMLButtonElement>('button[aria-label="Open navigation"]')!.click();
    expect(menu.open).toBe(true);

    menu.querySelector<HTMLAnchorElement>(`a[href="${path}"]`)!.click();

    await vi.waitFor(() => {
      flush();
      expect(location.pathname).toBe(path);
      expect(menu.open).toBe(false);
    });
  },
);
