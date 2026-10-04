import { type Icon as IconData, resolveIcon, shouldIconFlip } from '@wikimedia/codex-icons';

export interface IconProps {
  icon: IconData;
  class?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
}

/** Decorative icon. Put the accessible name on the enclosing button or link. */
export function Icon(props: IconProps) {
  const resolved = () => resolveIcon(props.icon, props.lang ?? 'en', props.dir ?? 'ltr');

  const markup = () => {
    const value = resolved();

    return typeof value === 'string' ? value : `<path d="${value.path}" />`;
  };

  return (
    <svg
      class={`fern-icon ${props.class ?? ''}`}
      viewBox="0 0 20 20"
      aria-hidden="true"
      tabindex="-1"
      style={{
        transform:
          props.dir === 'rtl' && shouldIconFlip(props.icon, props.lang ?? 'en')
            ? 'scaleX(-1)'
            : undefined,
      }}
      innerHTML={markup()}
    />
  );
}
