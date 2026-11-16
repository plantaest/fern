import type { JSX } from '@solidjs/web';
import { cva } from 'class-variance-authority';
import { omit } from 'solid-js';

const buttonGroupVariants = cva('fern-button-group', {
  variants: {
    orientation: {
      horizontal: null,
      vertical: 'fern-button-group-orientation--vertical',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export interface ButtonGroupProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'role'> {
  orientation?: ButtonGroupOrientation;
  class?: string;
}

/** A group of related action buttons. */
export function ButtonGroup(props: ButtonGroupProps) {
  const rest = omit(props, 'orientation', 'class');

  return (
    // biome-ignore lint/a11y/useSemanticElements: An action group can contain links as well as form controls.
    <div
      {...rest}
      role="group"
      class={buttonGroupVariants({ orientation: props.orientation, class: props.class })}
    />
  );
}
