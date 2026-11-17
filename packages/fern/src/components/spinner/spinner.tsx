import type { JSX } from '@solidjs/web';
import { cva, type VariantProps } from 'class-variance-authority';
import { omit } from 'solid-js';

const spinnerVariants = cva('fern-spinner', {
  variants: {
    size: {
      xs: 'fern-spinner-size--xs',
      sm: 'fern-spinner-size--sm',
      default: null,
      lg: 'fern-spinner-size--lg',
    },
  },
  defaultVariants: { size: 'default' },
});

export type SpinnerSize = NonNullable<VariantProps<typeof spinnerVariants>['size']>;

export interface SpinnerProps
  extends Omit<
    JSX.HTMLAttributes<HTMLSpanElement>,
    'children' | 'contenteditable' | 'innerHTML' | 'innerText' | 'role' | 'tabindex' | 'textContent'
  > {
  size?: SpinnerSize;
}

/** An indicator for an ongoing operation of unknown duration. */
export function Spinner(props: SpinnerProps) {
  const rest = omit(props, 'size', 'class', 'aria-label');

  return (
    <span
      {...rest}
      role="status"
      aria-label={props['aria-label'] ?? 'Loading'}
      class={[spinnerVariants({ size: props.size }), props.class]}
    />
  );
}
