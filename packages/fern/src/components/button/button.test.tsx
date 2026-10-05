import { render } from '@solidjs/web';
import { cdxIconArrowNext, cdxIconEdit } from '@wikimedia/codex-icons';
import { createRoot, createSignal, flush } from 'solid-js';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { Icon } from '../icon';
import {
  Button,
  type ButtonAction,
  type ButtonSize,
  type ButtonStyleProps,
  type ButtonVariant,
  buttonVariants,
} from './button';

const disposers: (() => void)[] = [];

afterEach(() => {
  disposers.splice(0).forEach((dispose) => {
    dispose();
  });
  document.body.innerHTML = '';
});

function mount(view: () => import('@solidjs/web').JSX.Element) {
  const host = document.createElement('div');
  document.body.append(host);
  disposers.push(render(view, host));
  flush();

  return host;
}

describe('Button contract on Solid 2', () => {
  it('preserves default classes when style props are omitted or undefined', () => {
    const expected = 'fern-button fern-button-variant--solid fern-button-action--neutral';

    expect(buttonVariants()).toBe(expected);
    expect(
      buttonVariants({ variant: undefined, action: undefined, size: undefined, class: undefined }),
    ).toBe(expected);
    expect(buttonVariants({ variant: 'solid', action: 'neutral', size: 'default' })).toBe(expected);
  });

  it.each([
    'solid',
    'soft',
    'surface',
    'outline',
    'ghost',
  ] as const)('combines %s, icon size, and custom classes', (variant) => {
    expect(
      buttonVariants({ variant, action: 'destructive', size: 'icon', class: 'custom-class' }),
    ).toBe(
      `fern-button fern-button-variant--${variant} fern-button-action--destructive fern-button-size--icon custom-class`,
    );
  });

  it('exposes CVA class composition and explicit omission of default variants', () => {
    expect(buttonVariants({ className: ['custom-class', { active: true }] })).toBe(
      'fern-button fern-button-variant--solid fern-button-action--neutral custom-class active',
    );
    expect(buttonVariants({ variant: null, action: null, size: null, class: 'custom-class' })).toBe(
      'fern-button custom-class',
    );

    expectTypeOf<ButtonStyleProps['variant']>().toEqualTypeOf<ButtonVariant | undefined>();
    expectTypeOf<ButtonStyleProps['action']>().toEqualTypeOf<ButtonAction | undefined>();
    expectTypeOf<ButtonStyleProps['size']>().toEqualTypeOf<ButtonSize | undefined>();
    expectTypeOf<ButtonStyleProps['class']>().toEqualTypeOf<string | undefined>();
  });

  it('forwards native attributes, accessible names, refs, children, and events', () => {
    let clicks = 0;
    let ref: HTMLButtonElement | undefined;

    const host = mount(() => (
      <Button
        id="save"
        aria-label="Save draft"
        title="Save"
        data-test="native"
        ref={(element) => {
          ref = element;
        }}
        onClick={() => clicks++}
      >
        Save
      </Button>
    ));

    const button = host.querySelector('button')!;

    expect(button.type).toBe('button');
    expect(button.id).toBe('save');
    expect(button.getAttribute('aria-label')).toBe('Save draft');
    expect(button.dataset.test).toBe('native');
    expect(button.title).toBe('Save');
    expect(ref).toBe(button);

    button.click();
    expect(clicks).toBe(1);
  });

  it('reactively updates style props, disabled, and label', () => {
    let clicks = 0;

    const state = createRoot((dispose) => {
      disposers.push(dispose);

      const [variant, setVariant] = createSignal<ButtonVariant>('outline');
      const [action, setAction] = createSignal<ButtonAction>('neutral');
      const [size, setSize] = createSignal<ButtonSize | undefined>();
      const [customClass, setCustomClass] = createSignal<string | undefined>();
      const [disabled, setDisabled] = createSignal(false);
      const [label, setLabel] = createSignal('Before');

      const host = mount(() => (
        <Button
          variant={variant()}
          action={action()}
          size={size()}
          class={customClass()}
          disabled={disabled()}
          onClick={() => clicks++}
        >
          {label()}
        </Button>
      ));

      return { host, setVariant, setAction, setSize, setCustomClass, setDisabled, setLabel };
    });

    const button = state.host.querySelector('button')!;

    state.setVariant('surface');
    state.setAction('destructive');
    state.setSize('icon-lg');
    state.setCustomClass('custom-class');
    state.setDisabled(true);
    state.setLabel('After');
    flush();

    expect(button.className).toBe(
      'fern-button fern-button-variant--surface fern-button-action--destructive fern-button-size--icon-lg custom-class',
    );
    expect(button.textContent).toBe('After');
    expect(button.disabled).toBe(true);
    expect(button.hasAttribute('data-disabled')).toBe(true);
    expect(button.hasAttribute('action')).toBe(false);
    expect(button.hasAttribute('size')).toBe(false);

    button.click();
    expect(clicks).toBe(0);

    state.setSize('sm');
    flush();

    expect(button.className).toContain('fern-button-size--sm');
    expect(button.className).not.toContain('fern-button-size--icon-lg');

    state.setSize(undefined);
    state.setAction('progressive');
    state.setCustomClass(undefined);
    state.setDisabled(false);
    flush();

    expect(button.className).toBe(
      'fern-button fern-button-variant--surface fern-button-action--progressive',
    );

    button.click();
    expect(clicks).toBe(1);
  });

  it('only explicit submit buttons submit their form', () => {
    let submits = 0;

    const host = mount(() => (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submits++;
        }}
      >
        <Button>Preview</Button>
        <Button type="submit">Submit</Button>
      </form>
    ));

    const buttons = host.querySelectorAll('button');

    buttons[0].click();
    expect(submits).toBe(0);

    buttons[1].click();
    expect(submits).toBe(1);
  });

  it('shares classes with native links while keeping native link semantics', () => {
    const host = mount(() => (
      <a
        href="/article"
        class={buttonVariants({ variant: 'outline', action: 'neutral', class: 'extra' })}
      >
        Read
      </a>
    ));

    const anchor = host.querySelector('a')!;

    expect(anchor.getAttribute('href')).toBe('/article');
    expect(anchor.getAttribute('role')).toBeNull();
    expect(anchor.className).toContain('fern-button-variant--outline');
    expect(anchor.className).toContain('fern-button-action--neutral');
    expect(anchor.className).toContain('extra');
  });

  it('keeps icons decorative and resolves RTL data', () => {
    const host = mount(() => (
      <>
        <Button size="icon" aria-label="Edit">
          <Icon icon={cdxIconEdit} />
        </Button>
        <Icon icon={cdxIconArrowNext} dir="rtl" />
      </>
    ));

    const icon = host.querySelector('svg')!;

    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.querySelector('path')).not.toBeNull();
    expect(host.querySelector('button')!.getAttribute('aria-label')).toBe('Edit');
    expect(host.querySelectorAll('svg')[1].innerHTML).not.toBe('');

    host.querySelector('button')!.focus();
    icon.focus();

    expect(document.activeElement).toBe(host.querySelector('button'));
  });
});
