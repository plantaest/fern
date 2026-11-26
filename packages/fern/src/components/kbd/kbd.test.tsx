import { render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { Kbd, type KbdSize } from './kbd';

it('renders a native key and forwards its content, classes, attributes, and ref', () => {
  const host = document.createElement('div');
  const [size, setSize] = createSignal<KbdSize | undefined>();
  let ref: HTMLElement | undefined;
  const dispose = render(
    () => (
      <Kbd
        id="next-page"
        size={size()}
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

    setSize('sm');
    flush();

    expect(key?.classList.contains('fern-kbd-size--sm')).toBe(true);
    expect(key?.hasAttribute('size')).toBe(false);
  } finally {
    dispose();
  }
});
