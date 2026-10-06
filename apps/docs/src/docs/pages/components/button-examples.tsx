import {
  Button,
  type ButtonAction,
  type ButtonSize,
  type ButtonVariant,
} from '@taxon-labs/fern/button';
import { Icon } from '@taxon-labs/fern/icon';
import { cdxIconEdit } from '@wikimedia/codex-icons';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { CodeBlock, Field, fieldControlClasses, Preview, PreviewFrame } from '../../ui';
import ButtonActionsDemo from './button-demos/actions';
import actionsSource from './button-demos/actions.tsx?raw';
import ButtonDestructiveDemo from './button-demos/destructive';
import destructiveSource from './button-demos/destructive.tsx?raw';
import ButtonDisabledDemo from './button-demos/disabled';
import disabledSource from './button-demos/disabled.tsx?raw';
import ButtonFormDemo from './button-demos/form';
import formSource from './button-demos/form.tsx?raw';
import ButtonLinkDemo from './button-demos/link';
import linkSource from './button-demos/link.tsx?raw';
import ButtonLinkVariantsDemo from './button-demos/link-variants';
import linkVariantsSource from './button-demos/link-variants.tsx?raw';
import ButtonSizesDemo from './button-demos/sizes';
import sizesSource from './button-demos/sizes.tsx?raw';
import ButtonVariantsDemo from './button-demos/variants';
import variantsSource from './button-demos/variants.tsx?raw';
import ButtonWithIconsDemo from './button-demos/with-icons';
import withIconsSource from './button-demos/with-icons.tsx?raw';

const variants = [
  'solid',
  'soft',
  'surface',
  'outline',
  'ghost',
] as const satisfies readonly ButtonVariant[];

const actions = [
  'neutral',
  'progressive',
  'destructive',
] as const satisfies readonly ButtonAction[];

const textSizes = ['sm', 'default', 'lg'] as const satisfies readonly ButtonSize[];
type TextButtonSize = (typeof textSizes)[number];

function iconSize(size: TextButtonSize): ButtonSize {
  return size === 'default' ? 'icon' : `icon-${size}`;
}

export function ButtonPlayground() {
  const [variant, setVariant] = createSignal<ButtonVariant>('solid');
  const [action, setAction] = createSignal<ButtonAction>('neutral');
  const [size, setSize] = createSignal<TextButtonSize>('default');
  const [label, setLabel] = createSignal('Save changes');
  const [disabled, setDisabled] = createSignal(false);
  const [icon, setIcon] = createSignal('none');
  const [clicks, setClicks] = createSignal(0);

  const name = () => label().trim() || 'Save changes';
  const selectedSize = () => (icon() === 'only' ? iconSize(size()) : size());
  const labelCode = () => {
    const value = JSON.stringify(name()).slice(1, -1).replaceAll('\\"', '"').replaceAll("'", "\\'");

    return `{'${value}'}`;
  };

  const code = createMemo(() => {
    const labelAttribute = /["&<>\r\n\t\u2028\u2029]/.test(name()) ? labelCode() : `"${name()}"`;
    const labelContent = /[&<>{}\r\n\t\u2028\u2029]/.test(name()) ? labelCode() : name();

    const attrs = [
      variant() !== 'solid' ? ` variant="${variant()}"` : '',
      action() !== 'neutral' ? ` action="${action()}"` : '',
      selectedSize() !== 'default' ? ` size="${selectedSize()}"` : '',
      disabled() ? ' disabled' : '',
      icon() === 'only' ? ` aria-label=${labelAttribute}` : '',
    ].join('');

    const content =
      icon() === 'only'
        ? '  <Icon icon={cdxIconEdit} />'
        : icon() === 'start'
          ? `  <Icon icon={cdxIconEdit} />\n  ${labelContent}`
          : `  ${labelContent}`;

    return `<Button${attrs}>\n${content}\n</Button>`;
  });

  return (
    <PreviewFrame class="playground @container">
      <div class="grid grid-cols-1 @min-[35rem]:grid-cols-[minmax(0,1fr)_15rem]">
        <Preview kind="playground">
          <Button
            variant={variant()}
            action={action()}
            disabled={disabled()}
            size={selectedSize()}
            aria-label={icon() === 'only' ? name() : undefined}
            onClick={() => setClicks((n) => n + 1)}
          >
            <Show when={icon() !== 'none'}>
              <Icon icon={cdxIconEdit} />
            </Show>
            <Show when={icon() !== 'only'}>{name()}</Show>
          </Button>
          <span class="text-content-subtle text-small-2xs" role="status">
            {clicks() === 0
              ? 'Try the button'
              : `Clicked ${clicks()} ${clicks() === 1 ? 'time' : 'times'}`}
          </span>
        </Preview>
        <div
          class="
            flex flex-col gap-4 p-5 bg-surface-neutral-subtle border-t border-line-subtle
            @min-[35rem]:border-t-0 @min-[35rem]:border-l
          "
        >
          <Field label="Variant" for="button-variant">
            <select
              id="button-variant"
              class={fieldControlClasses}
              value={variant()}
              onChange={(e) => setVariant(e.currentTarget.value as ButtonVariant)}
            >
              <For each={variants}>{(name) => <option value={name}>{name}</option>}</For>
            </select>
          </Field>
          <Field label="Action" for="button-action">
            <select
              id="button-action"
              class={fieldControlClasses}
              value={action()}
              onChange={(e) => setAction(e.currentTarget.value as ButtonAction)}
            >
              <For each={actions}>{(name) => <option value={name}>{name}</option>}</For>
            </select>
          </Field>
          <Field label="Size" for="button-size">
            <select
              id="button-size"
              class={fieldControlClasses}
              value={size()}
              onChange={(e) => setSize(e.currentTarget.value as TextButtonSize)}
            >
              <For each={textSizes}>{(name) => <option value={name}>{name}</option>}</For>
            </select>
          </Field>
          <Field label="Label" for="button-label">
            <input
              id="button-label"
              class={fieldControlClasses}
              value={label()}
              onInput={(e) => setLabel(e.currentTarget.value)}
            />
          </Field>
          <Field label="Icon" for="button-icon">
            <select
              id="button-icon"
              class={fieldControlClasses}
              value={icon()}
              onChange={(e) => setIcon(e.currentTarget.value)}
            >
              <option value="none">None</option>
              <option value="start">Before label</option>
              <option value="only">Icon only</option>
            </select>
          </Field>
          <label class="flex items-center gap-2 text-small-xs font-normal">
            <input
              class="size-4 m-0 accent-surface-progressive"
              type="checkbox"
              checked={disabled()}
              onChange={(e) => setDisabled(e.currentTarget.checked)}
            />
            Disabled
          </label>
        </div>
      </div>
      <CodeBlock code={code()} />
    </PreviewFrame>
  );
}

export function ButtonBasic() {
  const [basicCount, setBasicCount] = createSignal(0);

  return (
    <Preview kind="basic">
      <Button onClick={() => setBasicCount((n) => n + 1)}>Save changes</Button>
      <span class="text-small-xs text-content-subtle" role="status">
        {basicCount() ? 'Changes saved' : 'Built with Kobalte'}
      </span>
    </Preview>
  );
}

export const buttonVariantsExample = {
  component: ButtonVariantsDemo,
  source: variantsSource,
};

export const buttonActionsExample = {
  component: ButtonActionsDemo,
  source: actionsSource,
};

export const buttonSizesExample = {
  component: ButtonSizesDemo,
  source: sizesSource,
};

export const buttonWithIconsExample = {
  component: ButtonWithIconsDemo,
  source: withIconsSource,
};

export const buttonDestructiveExample = {
  component: ButtonDestructiveDemo,
  source: destructiveSource,
};

export const buttonDisabledExample = {
  component: ButtonDisabledDemo,
  source: disabledSource,
};

export const buttonFormExample = {
  component: ButtonFormDemo,
  source: formSource,
};

export const buttonLinkExample = {
  component: ButtonLinkDemo,
  source: linkSource,
};

export const buttonLinkVariantsExample = {
  component: ButtonLinkVariantsDemo,
  source: linkVariantsSource,
};
