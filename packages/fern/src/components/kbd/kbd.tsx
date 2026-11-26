import type { JSX } from '@solidjs/web';
import { cva, type VariantProps } from 'class-variance-authority';
import { omit } from 'solid-js';

const kbdVariants = cva('fern-kbd', {
  variants: {
    size: {
      sm: 'fern-kbd-size--sm',
      default: null,
    },
  },
  defaultVariants: { size: 'default' },
});

export type KbdSize = NonNullable<VariantProps<typeof kbdVariants>['size']>;
export type KbdProps = JSX.HTMLAttributes<HTMLElement> & { size?: KbdSize };

/** A label for a keyboard key or shortcut. */
export function Kbd(props: KbdProps) {
  const rest = omit(props, 'size', 'class');

  return <kbd {...rest} class={[kbdVariants({ size: props.size }), props.class]} />;
}
