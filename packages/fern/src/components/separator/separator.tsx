import type { JSX } from '@solidjs/web';
import { cva } from 'class-variance-authority';
import { omit } from 'solid-js';

const separatorVariants = cva('fern-separator', {
  variants: {
    orientation: {
      horizontal: null,
      vertical: 'fern-separator-orientation--vertical',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps extends Omit<JSX.HTMLAttributes<HTMLHRElement>, 'children'> {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  class?: string;
}

/** A static boundary between sections or groups. */
export function Separator(props: SeparatorProps) {
  const rest = omit(props, 'orientation', 'decorative', 'class');

  return (
    <hr
      aria-hidden={props.decorative ? 'true' : undefined}
      aria-orientation={
        !props.decorative && props.orientation === 'vertical' ? 'vertical' : undefined
      }
      {...rest}
      class={separatorVariants({ orientation: props.orientation, class: props.class })}
    />
  );
}
