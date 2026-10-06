import { type ButtonRootProps, Button as KobalteButton } from '@kobalte/core/button';
import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import type { ValidComponent } from '@solidjs/web';
import { cva, type VariantProps } from 'class-variance-authority';
import { omit } from 'solid-js';

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

export type ButtonProps<T extends ValidComponent = 'button'> = PolymorphicProps<
  T,
  ButtonRootProps<T>
> & {
  variant?: ButtonVariant;
  action?: ButtonAction;
  size?: ButtonSize;
  class?: string;
  type?: 'button' | 'submit' | 'reset';
};

/** Action button. Render navigation as an anchor with the as prop. */
export function Button<T extends ValidComponent = 'button'>(props: ButtonProps<T>) {
  const rest = omit(props as ButtonProps, 'variant', 'action', 'size', 'class', 'type');

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
