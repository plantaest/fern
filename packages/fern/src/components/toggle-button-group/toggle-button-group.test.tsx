import { type JSX, render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { afterEach, expect, it, vi } from 'vitest';
import type { ToggleButtonVariant } from '../toggle-button/toggle-button';
import { ToggleButtonGroup, ToggleButtonGroupItem } from './toggle-button-group';

const cleanups: (() => void)[] = [];

afterEach(() => {
  for (const cleanup of cleanups.splice(0)) cleanup();
});

function mount(view: () => JSX.Element) {
  const host = document.body.appendChild(document.createElement('div'));
  const dispose = render(view, host);
  cleanups.push(() => {
    dispose();
    host.remove();
  });
  flush();

  const group = host.querySelector<HTMLDivElement>('[role="group"]')!;
  const buttons = Array.from(group.querySelectorAll('button'));

  function pressed() {
    return buttons.filter((button) => button.getAttribute('aria-pressed') === 'true');
  }

  return { group, buttons, pressed };
}

function click(button: HTMLButtonElement) {
  button.click();
  flush();
}

it('replaces the single selection and clears it when the selected item is activated again', () => {
  const onChange = vi.fn();
  const { group, buttons, pressed } = mount(() => (
    <ToggleButtonGroup aria-label="Page type" defaultValue="article" onChange={onChange}>
      <ToggleButtonGroupItem value="article">Article</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="talk">Talk</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ));
  const [article, talk] = buttons;

  expect(group.getAttribute('aria-label')).toBe('Page type');
  expect(pressed()).toEqual([article]);

  click(talk);
  expect(pressed()).toEqual([talk]);

  click(talk);
  expect(pressed()).toEqual([]);
  expect(onChange.mock.calls).toEqual([['talk'], [null]]);
});

it('uses null as a controlled value and waits for the application to update it', () => {
  const [value, setValue] = createSignal<string | null>(null);
  const onChange = vi.fn();
  const { buttons, pressed } = mount(() => (
    <ToggleButtonGroup value={value()} onChange={onChange}>
      <ToggleButtonGroupItem value="article">Article</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ));
  const [article] = buttons;

  click(article);
  expect(pressed()).toEqual([]);
  expect(onChange).toHaveBeenLastCalledWith('article');

  setValue('article');
  flush();
  expect(pressed()).toEqual([article]);

  click(article);
  expect(pressed()).toEqual([article]);
  expect(onChange).toHaveBeenLastCalledWith(null);

  setValue(null);
  flush();
  expect(pressed()).toEqual([]);
});

it('toggles multiple values independently without mutating the controlled value', () => {
  const initial = ['bold'];
  const [value, setValue] = createSignal(initial);
  const changes = vi.fn(setValue);
  const { buttons, pressed } = mount(() => (
    <ToggleButtonGroup multiple value={value()} onChange={changes}>
      <ToggleButtonGroupItem value="bold">Bold</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="italic">Italic</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ));
  const [bold, italic] = buttons;

  click(italic);
  expect(pressed()).toEqual([bold, italic]);

  click(bold);
  expect(pressed()).toEqual([italic]);

  click(italic);
  expect(pressed()).toEqual([]);
  expect(changes.mock.calls).toEqual([[['bold', 'italic']], [['italic']], [[]]]);
  expect(initial).toEqual(['bold']);
});

it('uses surface by default and applies the group variant and size to every item', () => {
  const [variant, setVariant] = createSignal<ToggleButtonVariant>();
  const { group, buttons, pressed } = mount(() => (
    <ToggleButtonGroup
      variant={variant()}
      size="sm"
      defaultValue="bold"
      class={{ 'formatting-group': true }}
    >
      <ToggleButtonGroupItem
        value="bold"
        class={['bold-control', { 'ghost-control': variant() === 'ghost' }]}
      >
        Bold
      </ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="italic">Italic</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ));

  expect(group.classList.contains('fern-toggle-button-group-variant--surface')).toBe(true);
  expect(
    buttons.every((button) => button.classList.contains('fern-toggle-button-variant--surface')),
  ).toBe(true);
  expect(buttons.every((button) => button.classList.contains('fern-button-size--sm'))).toBe(true);
  expect(group.classList.contains('formatting-group')).toBe(true);
  expect(buttons[0].classList.contains('ghost-control')).toBe(false);

  setVariant('ghost');
  flush();

  expect(group.classList.contains('fern-toggle-button-group-variant--ghost')).toBe(true);
  expect(
    buttons.every((button) => button.classList.contains('fern-toggle-button-variant--ghost')),
  ).toBe(true);
  expect(pressed()).toEqual([buttons[0]]);
  expect(buttons[0].classList.contains('bold-control')).toBe(true);
  expect(buttons[0].classList.contains('ghost-control')).toBe(true);
});

it('inherits group disabled state and preserves disabled items and selection', () => {
  const [disabled, setDisabled] = createSignal(true);
  const onChange = vi.fn();
  const { group, buttons, pressed } = mount(() => (
    <ToggleButtonGroup multiple defaultValue={['bold']} disabled={disabled()} onChange={onChange}>
      <ToggleButtonGroupItem value="bold">Bold</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="italic" disabled>
        Italic
      </ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="underline">Underline</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ));
  const [bold, italic, underline] = buttons;

  expect(group.getAttribute('aria-disabled')).toBe('true');
  expect(buttons.every((button) => button.disabled)).toBe(true);
  click(underline);
  expect(onChange).not.toHaveBeenCalled();
  expect(pressed()).toEqual([bold]);

  setDisabled(false);
  flush();
  click(italic);
  expect(onChange).not.toHaveBeenCalled();

  click(underline);
  expect(pressed()).toEqual([bold, underline]);
  expect(onChange).toHaveBeenCalledExactlyOnceWith(['bold', 'underline']);
});

it('keeps enabled items tabbable and moves arrow focus past a disabled selection', () => {
  const { group, buttons, pressed } = mount(() => (
    <ToggleButtonGroup orientation="vertical" defaultValue="two">
      <ToggleButtonGroupItem value="one">One</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="two" disabled>
        Two
      </ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="three">Three</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ));
  const [one, two, three] = buttons;

  function pressArrow(key: string) {
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    flush();
  }

  expect(group.tabIndex).toBe(-1);
  expect([one.tabIndex, three.tabIndex]).toEqual([0, 0]);

  one.focus();
  pressArrow('ArrowRight');
  expect(document.activeElement).toBe(one);

  pressArrow('ArrowDown');
  expect(document.activeElement).toBe(three);
  expect(pressed()).toEqual([two]);

  pressArrow('ArrowDown');
  expect(document.activeElement).toBe(three);

  pressArrow('ArrowUp');
  expect(document.activeElement).toBe(one);
});
