import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import { dynamic, type JSX, type ValidComponent } from '@solidjs/web';
import { cdxIconUserAvatar } from '@wikimedia/codex-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { createEffect, createMemo, createSignal, omit, Show } from 'solid-js';
import { Icon } from '../icon/icon.jsx';

const avatarVariants = cva('fern-avatar', {
  variants: {
    size: {
      sm: 'fern-avatar-size--sm',
      default: null,
      lg: 'fern-avatar-size--lg',
    },
  },
});

const avatarStatusVariants = cva('fern-avatar-status', {
  variants: {
    status: {
      online: 'fern-avatar-status--online',
      away: 'fern-avatar-status--away',
      busy: 'fern-avatar-status--busy',
      offline: 'fern-avatar-status--offline',
    },
  },
  defaultVariants: { status: 'online' },
});

export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;
export type AvatarStatusValue = NonNullable<VariantProps<typeof avatarStatusVariants>['status']>;

export type AvatarProps<T extends ValidComponent = 'span'> = PolymorphicProps<
  T,
  { size?: AvatarSize }
>;
export type AvatarImageProps = Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, 'children'>;
export type AvatarFallbackProps = JSX.HTMLAttributes<HTMLSpanElement>;
export type AvatarStatusProps = Omit<
  JSX.HTMLAttributes<HTMLSpanElement>,
  'aria-hidden' | 'children'
> & { status?: AvatarStatusValue };
export type AvatarGroupProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'role'>;
export type AvatarGroupCountProps = JSX.HTMLAttributes<HTMLSpanElement>;

/** A profile image with an optional fallback and status. */
export function Avatar<T extends ValidComponent = 'span'>(props: AvatarProps<T>) {
  const rest = omit(props as AvatarProps, 'as', 'size', 'class', 'children');
  const Root = dynamic(() => props.as ?? 'span');

  return (
    <Root
      type={props.as === 'button' ? 'button' : undefined}
      {...rest}
      class={[avatarVariants({ size: props.size }), props.class]}
    >
      <span class="fern-avatar-fallback fern-avatar-default-fallback" aria-hidden="true">
        <Icon icon={cdxIconUserAvatar} />
      </span>
      {props.children}
    </Root>
  );
}

export function AvatarImage(props: AvatarImageProps) {
  const rest = omit(props, 'alt', 'src', 'srcset', 'sizes', 'class', 'hidden', 'ref');
  const source = createMemo(() => {
    const src = typeof props.src === 'string' && props.src.trim() ? props.src : undefined;
    const srcset =
      typeof props.srcset === 'string' && props.srcset.trim() ? props.srcset : undefined;

    return src || srcset ? { src, srcset, sizes: props.sizes } : undefined;
  });

  return (
    <Show when={source()} keyed>
      {(selected) => {
        const [image, setImage] = createSignal<HTMLImageElement>();
        const [failed, setFailed] = createSignal(false);

        createEffect(image, (element) => {
          if (!element) {
            return;
          }

          const onError = () => setFailed(true);
          const onLoad = () => setFailed(false);
          element.addEventListener('error', onError);
          element.addEventListener('load', onLoad);

          // The browser can finish loading the pre-rendered image before hydration.
          if (element.complete && !element.naturalWidth && (selected.src || element.currentSrc)) {
            setFailed(true);
          }

          return () => {
            element.removeEventListener('error', onError);
            element.removeEventListener('load', onLoad);
          };
        });

        return (
          <img
            {...rest}
            class={['fern-avatar-image', props.class]}
            alt={props.alt ?? ''}
            sizes={selected.sizes}
            srcset={selected.srcset}
            src={selected.src}
            hidden={failed() || props.hidden}
            ref={[setImage, props.ref]}
          />
        );
      }}
    </Show>
  );
}

export function AvatarFallback(props: AvatarFallbackProps) {
  const rest = omit(props, 'class');

  return <span {...rest} class={['fern-avatar-fallback', props.class]} />;
}

export function AvatarStatus(props: AvatarStatusProps) {
  const rest = omit(props, 'status', 'class');

  return (
    <span
      {...rest}
      class={[avatarStatusVariants({ status: props.status }), props.class]}
      aria-hidden="true"
    />
  );
}

export function AvatarGroup(props: AvatarGroupProps) {
  const rest = omit(props, 'class');

  return (
    // biome-ignore lint/a11y/useSemanticElements: An avatar group can contain static images and links.
    <div {...rest} role="group" class={['fern-avatar-group', props.class]} />
  );
}

export function AvatarGroupCount(props: AvatarGroupCountProps) {
  const rest = omit(props, 'class');

  return <span {...rest} class={['fern-avatar-group-count', props.class]} />;
}
