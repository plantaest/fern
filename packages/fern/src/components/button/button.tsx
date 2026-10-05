import { Button as KobalteButton } from '@kobalte/core/button';
import type { JSX } from '@solidjs/web';
import { cva, type VariantProps } from 'class-variance-authority';
import { omit } from 'solid-js';

/** Shared classes for a Button or a native anchor. Does not change semantics. */
export const buttonVariants = cva('fern-button', {
  variants: {
    variant: {
      solid: 'fern-button-variant--solid',
      soft: 'fern-button-variant--soft',
      surface: 'fern-button-variant--surface',
      outline: 'fern-button-variant--outline',
      ghost: 'fern-button-variant--ghost',
    },
    action: {
      neutral: 'fern-button-action--neutral',
      progressive: 'fern-button-action--progressive',
      destructive: 'fern-button-action--destructive',
    },
    size: {
      sm: 'fern-button-size--sm',
      default: null,
      lg: 'fern-button-size--lg',
      'icon-sm': 'fern-button-size--icon-sm',
      icon: 'fern-button-size--icon',
      'icon-lg': 'fern-button-size--icon-lg',
    },
  },
  defaultVariants: {
    variant: 'solid',
    action: 'neutral',
    size: 'default',
  },
});

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonAction = NonNullable<VariantProps<typeof buttonVariants>['action']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  action?: ButtonAction;
  size?: ButtonSize;
  class?: string;
}

export type ButtonProps = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'disabled' | 'tabindex'
> &
  ButtonStyleProps & {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    tabindex?: number | string;
  };

export function Button(props: ButtonProps) {
  const rest = omit(props, 'variant', 'action', 'size', 'class', 'type');

  return (
    <KobalteButton
      {...rest}
      type={props.type ?? 'button'}
      class={buttonVariants({
        variant: props.variant,
        action: props.action,
        size: props.size,
        class: props.class,
      })}
    />
  );
}
