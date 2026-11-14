import { render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { Separator, type SeparatorOrientation } from './separator';

it('updates orientation and exposes only meaningful separators to assistive technology', () => {
  const [orientation, setOrientation] = createSignal<SeparatorOrientation | undefined>();
  const [decorative, setDecorative] = createSignal(false);
  const host = document.createElement('div');
  const dispose = render(
    () => <Separator orientation={orientation()} decorative={decorative()} />,
    host,
  );

  try {
    flush();
    const rule = host.querySelector('hr')!;

    expect(rule.classList.contains('fern-separator-orientation--vertical')).toBe(false);
    expect(rule.tabIndex).toBe(-1);
    expect(rule.hasAttribute('aria-orientation')).toBe(false);
    expect(rule.hasAttribute('aria-hidden')).toBe(false);

    setOrientation('vertical');
    flush();

    expect(rule.classList.contains('fern-separator-orientation--vertical')).toBe(true);
    expect(rule.getAttribute('aria-orientation')).toBe('vertical');

    setDecorative(true);
    flush();

    expect(rule.getAttribute('aria-hidden')).toBe('true');
    expect(rule.hasAttribute('aria-orientation')).toBe(false);

    setDecorative(false);
    flush();

    expect(rule.hasAttribute('aria-hidden')).toBe(false);
    expect(rule.getAttribute('aria-orientation')).toBe('vertical');
  } finally {
    dispose();
  }
});
