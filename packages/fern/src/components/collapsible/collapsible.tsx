import {
  Content,
  type CollapsibleTriggerProps as KobalteTriggerProps,
  Root,
  Trigger,
  useCollapsibleContext,
} from '@kobalte/core/collapsible';
import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import type { JSX, ValidComponent } from '@solidjs/web';
import { createUniqueId, omit } from 'solid-js';

export interface CollapsibleProps extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export type CollapsibleTriggerProps<T extends ValidComponent = 'button'> = PolymorphicProps<
  T,
  KobalteTriggerProps<T> & {
    'aria-expanded'?: never;
    'aria-controls'?: never;
    type?: never;
  }
>;

export interface CollapsibleContentProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'hidden'> {}

/** A disclosure that preserves its content when closed. */
export function Collapsible(props: CollapsibleProps) {
  const rest = omit(props, 'class', 'id');
  const id = createUniqueId();

  return (
    <Root
      {...rest}
      as="div"
      id={props.id || `fern-collapsible-${id}`}
      forceMount
      class={['fern-collapsible', props.class]}
    />
  );
}

export function CollapsibleTrigger<T extends ValidComponent = 'button'>(
  props: CollapsibleTriggerProps<T>,
) {
  const context = useCollapsibleContext();
  const local = props as CollapsibleTriggerProps;
  const rest = omit(local, 'as', 'class', 'disabled', 'aria-expanded', 'aria-controls');

  return (
    <Trigger
      {...rest}
      as={props.as ?? 'button'}
      type="button"
      disabled={context.disabled() || local.disabled}
      class={['fern-collapsible-trigger', local.class]}
    />
  );
}

export function CollapsibleContent(props: CollapsibleContentProps) {
  const context = useCollapsibleContext();
  const rest = omit(props, 'class', 'id', 'style');

  return (
    <Content
      {...rest}
      as="div"
      id={props.id || context.generateId('content')}
      style={props.style || undefined}
      hidden={!context.isOpen()}
      class={['fern-collapsible-content', props.class]}
    />
  );
}
