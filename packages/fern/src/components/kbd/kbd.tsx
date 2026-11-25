import type { JSX } from '@solidjs/web';
import { omit } from 'solid-js';

export type KbdProps = JSX.HTMLAttributes<HTMLElement>;

/** A label for a keyboard key or shortcut. */
export function Kbd(props: KbdProps) {
  return <kbd {...omit(props, 'class')} class={['fern-kbd', props.class]} />;
}
