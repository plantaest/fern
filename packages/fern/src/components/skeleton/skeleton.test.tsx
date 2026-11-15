import { render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { Skeleton } from './skeleton';

it('hides the placeholder from assistive technology and updates its pulse', () => {
  const [animate, setAnimate] = createSignal<boolean | undefined>();
  const host = document.createElement('div');
  const dispose = render(() => <Skeleton animate={animate()} />, host);

  try {
    flush();
    const placeholder = host.querySelector('div')!;
    const pulseClass = 'fern-skeleton-animation--pulse';

    expect(placeholder.getAttribute('aria-hidden')).toBe('true');
    expect(placeholder.classList.contains(pulseClass)).toBe(true);

    setAnimate(false);
    flush();

    expect(placeholder.classList.contains(pulseClass)).toBe(false);

    setAnimate(true);
    flush();

    expect(placeholder.classList.contains(pulseClass)).toBe(true);
  } finally {
    dispose();
  }
});
