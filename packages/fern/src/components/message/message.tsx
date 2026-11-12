import type { JSX } from '@solidjs/web';
import {
  cdxIconAlert,
  cdxIconClose,
  cdxIconError,
  cdxIconInfoFilled,
  cdxIconSuccess,
  type Icon as IconData,
} from '@wikimedia/codex-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { omit, Show } from 'solid-js';
import { Button } from '../button/button.jsx';
import { Icon } from '../icon/icon.jsx';

const messageVariants = cva('fern-message', {
  variants: {
    type: {
      notice: 'fern-message-type--notice',
      success: 'fern-message-type--success',
      warning: 'fern-message-type--warning',
      error: 'fern-message-type--error',
    },
    inline: {
      false: 'fern-message-layout--block',
      true: 'fern-message-layout--inline',
    },
  },
  defaultVariants: { type: 'notice', inline: false },
});

export type MessageType = NonNullable<VariantProps<typeof messageVariants>['type']>;

type MessageContentProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'onClose'> & {
  type?: MessageType;
  inline?: boolean;
  icon?: IconData;
  title?: string;
  closeButtonLabel?: string;
  class?: string;
};

export type MessageProps = MessageContentProps &
  (
    | { withCloseButton?: false; onClose?: () => void }
    | { withCloseButton: boolean; onClose: () => void }
  );

const messageIcons = {
  notice: cdxIconInfoFilled,
  success: cdxIconSuccess,
  warning: cdxIconAlert,
  error: cdxIconError,
};

/** System feedback in the page flow. */
export function Message(props: MessageProps) {
  const rest = omit(
    props,
    'type',
    'inline',
    'icon',
    'title',
    'withCloseButton',
    'closeButtonLabel',
    'onClose',
    'class',
    'children',
  );
  const type = () => props.type ?? 'notice';

  return (
    <div
      role={type() === 'error' ? 'alert' : undefined}
      aria-live={type() === 'error' ? undefined : 'polite'}
      {...rest}
      class={messageVariants({ type: type(), inline: props.inline, class: props.class })}
    >
      <Icon icon={props.icon ?? messageIcons[type()]} class="fern-message-icon" />
      <div class="fern-message-content">
        <Show when={props.title}>
          <div class="fern-message-title">{props.title}</div>
        </Show>
        <div class="fern-message-body">{props.children}</div>
      </div>
      <Show when={!props.inline && props.withCloseButton && props.onClose}>
        <Button
          class="fern-message-close"
          variant="ghost"
          size="icon-sm"
          aria-label={props.closeButtonLabel?.trim() || 'Close'}
          onClick={() => props.onClose?.()}
        >
          <Icon icon={cdxIconClose} />
        </Button>
      </Show>
    </div>
  );
}
