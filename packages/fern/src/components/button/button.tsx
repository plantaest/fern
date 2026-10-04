import { Button as KobalteButton } from '@kobalte/core/button';
import type { JSX } from '@solidjs/web';
import { cva, type VariantProps } from 'class-variance-authority';
import { omit } from 'solid-js';

/** Shared classes for a Button or a native anchor. Does not change semantics. */
export const buttonVariants = cva('fern-button', {
  variants: {
    variant: {
      default: 'fern-button-variant--default',
      outline: 'fern-button-variant--outline',
      secondary: 'fern-button-variant--secondary',
      ghost: 'fern-button-variant--ghost',
      destructive: 'fern-button-variant--destructive',
      link: 'fern-button-variant--link',
    },
    size: {
      default: null,
      icon: 'fern-button-size--icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export const buttonVariantNames = [
  'default',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'link',
] as const satisfies readonly ButtonVariant[];

export interface ButtonStyleProps {
  variant?: ButtonVariant;
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
  const rest = omit(props, 'variant', 'size', 'class', 'type');

  return (
    <KobalteButton
      {...rest}
      type={props.type ?? 'button'}
      class={buttonVariants({
        variant: props.variant,
        size: props.size,
        class: props.class,
      })}
    />
  );
}
