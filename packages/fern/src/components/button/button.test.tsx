import { type JSX, render } from '@solidjs/web';
import { cdxIconEdit } from '@wikimedia/codex-icons';
import { createRoot, createSignal, flush, omit } from 'solid-js';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { Icon } from '../icon/icon';
import {
  Button,
  type ButtonAction,
  type ButtonProps,
  type ButtonSize,
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

type LinkProps = Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };

function Link(props: LinkProps) {
  return <a {...omit(props, 'to')} href={props.to} />;
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

  it('renders an anchor with native link semantics and inferred attributes, refs, and events', () => {
    let ref: HTMLAnchorElement | undefined;
    let clicked: HTMLAnchorElement | undefined;

    const host = mount(() => (
      <Button
        as="a"
        href="/article"
        target="_blank"
        variant="outline"
        ref={(element) => {
          expectTypeOf(element).toEqualTypeOf<HTMLAnchorElement>();
          ref = element;
        }}
        onClick={(event) => {
          expectTypeOf(event.currentTarget).toMatchTypeOf<HTMLAnchorElement>();
          event.preventDefault();
          clicked = event.currentTarget;
        }}
      >
        Read
      </Button>
    ));

    const anchor = host.querySelector('a')!;

    expect(anchor.getAttribute('href')).toBe('/article');
    expect(anchor.target).toBe('_blank');
    expect(anchor.getAttribute('role')).toBeNull();
    expect(anchor.hasAttribute('type')).toBe(false);
    expect(anchor.hasAttribute('as')).toBe(false);
    expect(anchor.className).toContain('fern-button-variant--outline');
    expect(ref).toBe(anchor);

    anchor.click();

    expect(clicked).toBe(anchor);
  });

  it('forwards custom component props and keeps the destination and styling reactive', () => {
    let ref: HTMLAnchorElement | undefined;
    let clicks = 0;

    const state = createRoot((dispose) => {
      disposers.push(dispose);

      const [to, setTo] = createSignal('/before');
      const [variant, setVariant] = createSignal<ButtonVariant>('outline');
      const host = mount(() => (
        <Button
          as={Link}
          to={to()}
          variant={variant()}
          class="custom-link"
          aria-label="Read article"
          ref={(element) => {
            ref = element;
          }}
          onClick={(event) => {
            event.preventDefault();
            clicks++;
          }}
        >
          Read
        </Button>
      ));

      return { host, setTo, setVariant };
    });

    const anchor = state.host.querySelector('a')!;

    expect(anchor.getAttribute('href')).toBe('/before');
    expect(anchor.getAttribute('role')).toBeNull();
    expect(anchor.hasAttribute('type')).toBe(false);
    expect(anchor.hasAttribute('to')).toBe(false);
    expect(anchor.getAttribute('aria-label')).toBe('Read article');
    expect(anchor.textContent).toBe('Read');
    expect(ref).toBe(anchor);

    state.setTo('/after');
    state.setVariant('soft');
    flush();
    anchor.click();

    expect(anchor.getAttribute('href')).toBe('/after');
    expect(anchor.className).toContain('fern-button-variant--soft');
    expect(anchor.className).toContain('custom-link');
    expect(clicks).toBe(1);
  });

  it('requires custom props and keeps the default button type contract', () => {
    expectTypeOf<ButtonProps>().not.toHaveProperty('href');
    expectTypeOf<ButtonProps<typeof Link>>().toHaveProperty('to').toEqualTypeOf<string>();
    expectTypeOf<ButtonProps['type']>().toEqualTypeOf<'button' | 'submit' | 'reset' | undefined>();

    const invalidExamples = () => (
      <>
        {/* @ts-expect-error Native button props do not include href. */}
        <Button href="/article">Read</Button>
        {/* @ts-expect-error The custom component requires its destination prop. */}
        <Button as={Link}>Read</Button>
        {/* @ts-expect-error The destination must match the custom component's type. */}
        <Button as={Link} to={123}>
          Read
        </Button>
        {/* @ts-expect-error Button variants do not accept null. */}
        <Button variant={null}>Save</Button>
        {/* @ts-expect-error Button actions do not accept null. */}
        <Button action={null}>Save</Button>
        {/* @ts-expect-error Button sizes do not accept null. */}
        <Button size={null}>Save</Button>
      </>
    );

    expectTypeOf(invalidExamples).toBeFunction();
  });

  it('keeps icon-only buttons named and decorative icons unfocusable', () => {
    const host = mount(() => (
      <Button size="icon" aria-label="Edit">
        <Icon icon={cdxIconEdit} />
      </Button>
    ));

    const button = host.querySelector('button')!;
    const icon = host.querySelector('svg')!;

    expect(button.getAttribute('aria-label')).toBe('Edit');
    expect(icon.getAttribute('aria-hidden')).toBe('true');

    button.focus();
    icon.focus();

    expect(document.activeElement).toBe(button);
  });
});
