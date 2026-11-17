import { render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { Spinner, type SpinnerSize } from './spinner';

it('provides a default status label and supports naming or hiding the indicator', () => {
  const [label, setLabel] = createSignal<string>();
  const [hidden, setHidden] = createSignal(false);
  const host = document.createElement('div');
  let ref: HTMLSpanElement | undefined;
  const dispose = render(
    () => (
      <Spinner
        ref={(element) => {
          ref = element;
        }}
        aria-label={label()}
        aria-hidden={hidden() ? 'true' : undefined}
      />
    ),
    host,
  );

  try {
    flush();
    const spinner = host.querySelector('span')!;

    expect(ref).toBe(spinner);
    expect(spinner.getAttribute('role')).toBe('status');
    expect(spinner.getAttribute('aria-label')).toBe('Loading');
    expect(spinner.textContent).toBe('');

    setLabel('Loading search results');
    setHidden(true);
    flush();

    expect(spinner.getAttribute('aria-label')).toBe('Loading search results');
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
  } finally {
    dispose();
  }
});

it('updates the size and composes reactive Solid classes', () => {
  const [size, setSize] = createSignal<SpinnerSize>();
  const host = document.createElement('div');
  const dispose = render(
    () => <Spinner size={size()} class={['custom', { large: size() === 'lg' }]} />,
    host,
  );

  try {
    flush();
    const spinner = host.querySelector('span')!;

    expect([...spinner.classList]).toEqual(['fern-spinner', 'custom']);

    setSize('xs');
    flush();

    expect(spinner.classList.contains('fern-spinner-size--xs')).toBe(true);

    setSize('sm');
    flush();

    expect(spinner.classList.contains('fern-spinner-size--sm')).toBe(true);

    setSize('lg');
    flush();

    expect(new Set(spinner.classList)).toEqual(
      new Set(['fern-spinner', 'fern-spinner-size--lg', 'custom', 'large']),
    );
  } finally {
    dispose();
  }
});
