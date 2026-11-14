import type { JSX } from '@solidjs/web';
import { omit } from 'solid-js';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps extends Omit<JSX.HTMLAttributes<HTMLHRElement>, 'children'> {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  class?: string;
}

/** A static boundary between sections or groups. */
export function Separator(props: SeparatorProps) {
  const rest = omit(props, 'orientation', 'decorative', 'class');
  const isVertical = () => props.orientation === 'vertical';

  return (
    <hr
      aria-hidden={props.decorative ? 'true' : undefined}
      aria-orientation={!props.decorative && isVertical() ? 'vertical' : undefined}
      {...rest}
      class={[
        'fern-separator',
        { 'fern-separator-orientation--vertical': isVertical() },
        props.class,
      ]}
    />
  );
}
