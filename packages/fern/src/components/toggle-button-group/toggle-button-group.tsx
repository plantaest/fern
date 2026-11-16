import type { JSX } from '@solidjs/web';
import { cva, cx } from 'class-variance-authority';
import { createContext, createSignal, omit, useContext } from 'solid-js';
import type { ButtonSize } from '../button/button.jsx';
import {
  ToggleButton,
  type ToggleButtonProps,
  type ToggleButtonVariant,
} from '../toggle-button/toggle-button.jsx';

const toggleButtonGroupVariants = cva('fern-toggle-button-group', {
  variants: {
    variant: {
      surface: 'fern-toggle-button-group-variant--surface',
      ghost: 'fern-toggle-button-group-variant--ghost',
    },
    orientation: {
      horizontal: null,
      vertical: 'fern-toggle-button-group-orientation--vertical',
    },
  },
  defaultVariants: { variant: 'surface', orientation: 'horizontal' },
});

export type ToggleButtonGroupOrientation = 'horizontal' | 'vertical';

type ToggleButtonGroupSelection =
  | {
      multiple?: false;
      value?: string | null;
      defaultValue?: string | null;
      onChange?: (value: string | null) => void;
    }
  | {
      multiple: true;
      value?: string[];
      defaultValue?: string[];
      onChange?: (value: string[]) => void;
    };

export type ToggleButtonGroupProps = ToggleButtonGroupSelection &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, 'role' | 'aria-disabled' | 'tabindex' | 'onChange'> & {
    orientation?: ToggleButtonGroupOrientation;
    variant?: ToggleButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    class?: string;
  };

export interface ToggleButtonGroupItemProps
  extends Omit<
    ToggleButtonProps,
    'pressed' | 'defaultPressed' | 'onPressedChange' | 'variant' | 'size' | 'tabindex' | 'value'
  > {
  value: string;
}

const ToggleButtonGroupContext = createContext<{
  isPressed: (value: string) => boolean;
  toggle: (value: string) => void;
  isDisabled: () => boolean | undefined;
  size: () => ButtonSize | undefined;
  variant: () => ToggleButtonVariant | undefined;
}>();

/** A group of buttons that share a single or multiple selection. */
export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  const [selection, setSelection] = createSignal(props.defaultValue ?? null);
  const selected = () => (props.value === undefined ? selection() : props.value);
  const rest = omit(
    props,
    'multiple',
    'value',
    'defaultValue',
    'onChange',
    'orientation',
    'variant',
    'size',
    'disabled',
    'class',
    'onKeyDown',
  );

  function isPressed(value: string) {
    const current = selected();
    return Array.isArray(current) ? current.includes(value) : current === value;
  }

  function toggle(value: string) {
    if (props.disabled) {
      return;
    }

    if (props.multiple) {
      const current = selected();
      const values = Array.isArray(current) ? current : [];
      const next = values.includes(value)
        ? values.filter((key) => key !== value)
        : [...values, value];

      if (props.value === undefined) {
        setSelection(next);
      }

      props.onChange?.(next);
    } else {
      const next = isPressed(value) ? null : value;

      if (props.value === undefined) {
        setSelection(next);
      }

      props.onChange?.(next);
    }
  }

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    const handler = props.onKeyDown;
    if (typeof handler === 'function') {
      handler(event);
    } else if (handler) {
      handler[0](handler[1], event);
    }

    if (
      props.disabled ||
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    const group = event.currentTarget;
    const vertical = props.orientation === 'vertical';
    const previous = vertical ? 'ArrowUp' : 'ArrowLeft';
    const next = vertical ? 'ArrowDown' : 'ArrowRight';

    if (!(event.target instanceof HTMLButtonElement)) {
      return;
    }

    if (event.key !== previous && event.key !== next) {
      return;
    }

    const buttons = Array.from(
      group.querySelectorAll<HTMLButtonElement>(
        ':scope > button.fern-toggle-button-group-item:not(:disabled)',
      ),
    );
    const index = buttons.indexOf(event.target);
    if (index === -1) {
      return;
    }

    const rtl = !vertical && getComputedStyle(group).direction === 'rtl';
    const step = (event.key === next) !== rtl ? 1 : -1;

    event.preventDefault();
    buttons[index + step]?.focus();
  };

  return (
    <ToggleButtonGroupContext
      value={{
        isPressed,
        toggle,
        isDisabled: () => props.disabled,
        size: () => props.size,
        variant: () => props.variant,
      }}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: These buttons control application state rather than form fields. */}
      <div
        {...rest}
        role="group"
        aria-disabled={props.disabled ? 'true' : undefined}
        class={toggleButtonGroupVariants({
          variant: props.variant,
          orientation: props.orientation,
          class: props.class,
        })}
        onKeyDown={onKeyDown}
      />
    </ToggleButtonGroupContext>
  );
}

/** A toggle whose pressed state is managed by its group. */
export function ToggleButtonGroupItem(props: ToggleButtonGroupItemProps) {
  const group = useContext(ToggleButtonGroupContext);
  if (!group) {
    throw new Error('ToggleButtonGroupItem must be used within a ToggleButtonGroup.');
  }

  const rest = omit(props, 'class', 'disabled', 'value');

  return (
    <ToggleButton
      {...rest}
      value={props.value}
      variant={group.variant()}
      size={group.size()}
      disabled={group.isDisabled() || props.disabled}
      pressed={group.isPressed(props.value)}
      onPressedChange={() => group.toggle(props.value)}
      class={cx('fern-toggle-button-group-item', props.class)}
    />
  );
}
