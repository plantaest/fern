import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import { dynamic, type ValidComponent } from '@solidjs/web';
import { cva, type VariantProps } from 'class-variance-authority';
import { omit } from 'solid-js';

const badgeVariants = cva('fern-badge', {
  variants: {
    variant: {
      solid: 'fern-badge-variant--solid',
      soft: 'fern-badge-variant--soft',
      surface: 'fern-badge-variant--surface',
      outline: 'fern-badge-variant--outline',
      ghost: 'fern-badge-variant--ghost',
    },
    status: {
      subtle: 'fern-badge-status--subtle',
      notice: 'fern-badge-status--notice',
      progressive: 'fern-badge-status--progressive',
      success: 'fern-badge-status--success',
      warning: 'fern-badge-status--warning',
      error: 'fern-badge-status--error',
    },
    size: {
      sm: 'fern-badge-size--sm',
      default: null,
      lg: 'fern-badge-size--lg',
    },
  },
  defaultVariants: { variant: 'soft', status: 'notice', size: 'default' },
});

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
export type BadgeStatus = NonNullable<VariantProps<typeof badgeVariants>['status']>;
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>['size']>;

export type BadgeProps<T extends ValidComponent = 'span'> = PolymorphicProps<
  T,
  {
    variant?: BadgeVariant;
    status?: BadgeStatus;
    size?: BadgeSize;
  }
>;

/** A label for a category or status. Use as="a" for navigation. */
export function Badge<T extends ValidComponent = 'span'>(props: BadgeProps<T>) {
  const rest = omit(props as BadgeProps, 'as', 'variant', 'status', 'size', 'class');
  const Root = dynamic(() => props.as ?? 'span');

  return (
    <Root
      {...rest}
      class={[
        badgeVariants({ variant: props.variant, status: props.status, size: props.size }),
        props.class,
      ]}
    />
  );
}
