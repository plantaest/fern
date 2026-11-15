import { ToggleButton as KobalteToggleButton } from '@kobalte/core/toggle-button';
import type { JSX } from '@solidjs/web';
import { cva, type VariantProps } from 'class-variance-authority';
import { omit } from 'solid-js';
import { type ButtonSize, buttonVariants } from '../button/button.jsx';

const toggleButtonVariants = cva('fern-toggle-button', {
  variants: {
    variant: {
      surface: 'fern-toggle-button-variant--surface',
      ghost: 'fern-toggle-button-variant--ghost',
    },
  },
  defaultVariants: { variant: 'surface' },
});

export type ToggleButtonVariant = NonNullable<VariantProps<typeof toggleButtonVariants>['variant']>;

export interface ToggleButtonProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed' | 'onChange' | 'type'> {
  'aria-pressed'?: never;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: ToggleButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  class?: string;
}

/** A button that toggles a persistent pressed state. */
export function ToggleButton(props: ToggleButtonProps) {
  const rest = omit(props, 'variant', 'size', 'class', 'onPressedChange', 'aria-pressed');

  return (
    <KobalteToggleButton
      {...rest}
      as="button"
      type="button"
      onChange={props.onPressedChange}
      class={toggleButtonVariants({
        variant: props.variant,
        class: [buttonVariants({ variant: null, action: null, size: props.size }), props.class],
      })}
    />
  );
}
