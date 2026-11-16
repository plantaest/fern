import type { JSX } from '@solidjs/web';
import { omit } from 'solid-js';

export interface AspectRatioProps extends JSX.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

/** A frame with a width-to-height ratio. */
export function AspectRatio(props: AspectRatioProps) {
  const rest = omit(props, 'ratio', 'class', 'style');
  const frameStyle = () => {
    const ratio = props.ratio ?? 1;
    const style = props.style;

    return typeof style === 'string'
      ? `--fern-aspect-ratio: ${ratio}; ${style}`
      : { '--fern-aspect-ratio': ratio, ...style };
  };

  return <div {...rest} class={['fern-aspect-ratio', props.class]} style={frameStyle()} />;
}
