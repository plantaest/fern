import { type JSX, render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { AspectRatio } from './aspect-ratio';

it('defaults to a square and reacts to ratio changes', () => {
  const [ratio, setRatio] = createSignal<number | undefined>();
  const host = document.createElement('div');
  const dispose = render(() => <AspectRatio ratio={ratio()} />, host);

  try {
    flush();
    const frame = host.querySelector('div')!;

    expect(frame.style.getPropertyValue('--fern-aspect-ratio')).toBe('1');

    setRatio(16 / 9);
    flush();

    expect(frame.style.getPropertyValue('--fern-aspect-ratio')).toBe(String(16 / 9));
  } finally {
    dispose();
  }
});

it('forwards native props and preserves both forms of style', () => {
  const [style, setStyle] = createSignal<JSX.CSSProperties | string>({ width: '12rem' });
  const host = document.createElement('div');
  let ref: HTMLDivElement | undefined;
  const dispose = render(
    () => (
      <AspectRatio
        ratio={4 / 3}
        class={['preview', { framed: true }]}
        style={style()}
        data-preview=""
        ref={(element) => {
          ref = element;
        }}
      >
        <span>Media preview</span>
      </AspectRatio>
    ),
    host,
  );

  try {
    flush();
    const frame = host.querySelector('div')!;

    expect(ref).toBe(frame);
    expect([...frame.classList]).toEqual(['fern-aspect-ratio', 'preview', 'framed']);
    expect(frame.hasAttribute('data-preview')).toBe(true);
    expect(frame.querySelector('span')?.textContent).toBe('Media preview');
    expect(frame.style.width).toBe('12rem');

    setStyle('max-width: 18rem');
    flush();

    expect(frame.style.width).toBe('');
    expect(frame.style.maxWidth).toBe('18rem');
    expect(frame.style.getPropertyValue('--fern-aspect-ratio')).toBe(String(4 / 3));
  } finally {
    dispose();
  }
});
