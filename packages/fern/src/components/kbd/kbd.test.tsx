import { render } from '@solidjs/web';
import { flush } from 'solid-js';
import { expect, it } from 'vitest';
import { Kbd } from './kbd';

it('renders a native key and forwards its content, classes, attributes, and ref', () => {
  const host = document.createElement('div');
  let ref: HTMLElement | undefined;
  const dispose = render(
    () => (
      <Kbd
        id="next-page"
        class={['shortcut', { compact: true }]}
        style={{ 'letter-spacing': '0.05em' }}
        ref={(element) => {
          ref = element;
        }}
      >
        Page Down
      </Kbd>
    ),
    host,
  );

  try {
    flush();
    const key = host.querySelector('kbd');

    expect(key).not.toBeNull();
    expect(ref).toBe(key);
    expect(key?.id).toBe('next-page');
    expect(key?.textContent).toBe('Page Down');
    expect([...(key?.classList ?? [])]).toEqual(['fern-kbd', 'shortcut', 'compact']);
    expect(key?.style.letterSpacing).toBe('0.05em');
    expect(key?.tabIndex).toBe(-1);
  } finally {
    dispose();
  }
});
