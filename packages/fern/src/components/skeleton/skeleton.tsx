import type { JSX } from '@solidjs/web';
import { cva } from 'class-variance-authority';
import { omit } from 'solid-js';

const skeletonVariants = cva('fern-skeleton', {
  variants: {
    animate: {
      true: 'fern-skeleton-animation--pulse',
      false: null,
    },
  },
  defaultVariants: { animate: true },
});

export interface SkeletonProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    | 'aria-hidden'
    | 'children'
    | 'contenteditable'
    | 'innerHTML'
    | 'innerText'
    | 'tabindex'
    | 'textContent'
  > {
  animate?: boolean;
  class?: string;
}

/** A visual placeholder for content that is loading. */
export function Skeleton(props: SkeletonProps) {
  const rest = omit(props, 'animate', 'class');

  return (
    <div
      {...rest}
      class={skeletonVariants({ animate: props.animate, class: props.class })}
      aria-hidden="true"
    />
  );
}
