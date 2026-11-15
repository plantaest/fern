import { render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { expect, it, vi } from 'vitest';
import { ToggleButton } from './toggle-button';

it('toggles its own state and reports the new value in a form', () => {
  const host = document.body.appendChild(document.createElement('div'));
  const onPressedChange = vi.fn();
  const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
  const dispose = render(
    () => (
      <form onSubmit={onSubmit}>
        <ToggleButton onPressedChange={onPressedChange}>Bookmark</ToggleButton>
        <ToggleButton defaultPressed>Show line numbers</ToggleButton>
        <ToggleButton defaultPressed disabled onPressedChange={onPressedChange}>
          Bold
        </ToggleButton>
      </form>
    ),
    host,
  );

  try {
    flush();
    const [bookmark, lineNumbers, disabled] = host.querySelectorAll('button');
    expect(bookmark.type).toBe('button');
    expect(bookmark.getAttribute('aria-pressed')).toBe('false');
    expect(lineNumbers.getAttribute('aria-pressed')).toBe('true');

    bookmark.click();
    lineNumbers.click();
    disabled.click();
    flush();

    expect(bookmark.getAttribute('aria-pressed')).toBe('true');
    expect(lineNumbers.getAttribute('aria-pressed')).toBe('false');
    expect(disabled.disabled).toBe(true);
    expect(disabled.getAttribute('aria-pressed')).toBe('true');
    expect(onPressedChange.mock.calls).toEqual([[true]]);
    expect(onSubmit).not.toHaveBeenCalled();
  } finally {
    dispose();
    host.remove();
  }
});

it('reports user requests and renders the controlled state from props', () => {
  const host = document.body.appendChild(document.createElement('div'));
  const [pressed, setPressed] = createSignal(false);
  const onPressedChange = vi.fn();
  const dispose = render(
    () => (
      <ToggleButton pressed={pressed()} onPressedChange={onPressedChange}>
        Bookmark
      </ToggleButton>
    ),
    host,
  );

  try {
    flush();
    const button = host.querySelector('button')!;

    button.click();
    flush();

    expect(onPressedChange.mock.calls).toEqual([[true]]);
    expect(button.getAttribute('aria-pressed')).toBe('false');

    setPressed(true);
    flush();

    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(onPressedChange).toHaveBeenCalledTimes(1);

    button.click();
    flush();

    expect(onPressedChange.mock.calls).toEqual([[true], [false]]);
    expect(button.getAttribute('aria-pressed')).toBe('true');
  } finally {
    dispose();
    host.remove();
  }
});
