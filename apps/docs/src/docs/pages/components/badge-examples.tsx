import { Badge, type BadgeSize, type BadgeStatus, type BadgeVariant } from '@taxonlabs/fern/badge';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconStar } from '@wikimedia/codex-icons';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { CodeBlock, Field, fieldControlClasses, Preview, PreviewFrame } from '../../ui';
import BadgeCustomColorsDemo from './badge-demos/custom-colors';
import customColorsSource from './badge-demos/custom-colors.tsx?raw';
import BadgeLinkDemo from './badge-demos/link';
import linkSource from './badge-demos/link.tsx?raw';
import BadgeSizesDemo from './badge-demos/sizes';
import sizesSource from './badge-demos/sizes.tsx?raw';
import BadgeStatusesDemo from './badge-demos/statuses';
import statusesSource from './badge-demos/statuses.tsx?raw';
import BadgeVariantsDemo from './badge-demos/variants';
import variantsSource from './badge-demos/variants.tsx?raw';
import BadgeWithIconsDemo from './badge-demos/with-icons';
import withIconsSource from './badge-demos/with-icons.tsx?raw';

const variants = [
  'solid',
  'soft',
  'surface',
  'outline',
  'ghost',
] as const satisfies readonly BadgeVariant[];
const statuses = [
  'subtle',
  'notice',
  'progressive',
  'success',
  'warning',
  'error',
] as const satisfies readonly BadgeStatus[];
const sizes = ['sm', 'default', 'lg'] as const satisfies readonly BadgeSize[];
type IconPosition = 'none' | 'start' | 'end';

export function BadgePlayground() {
  const [variant, setVariant] = createSignal<BadgeVariant>('soft');
  const [status, setStatus] = createSignal<BadgeStatus>('notice');
  const [size, setSize] = createSignal<BadgeSize>('default');
  const [label, setLabel] = createSignal('New');
  const [icon, setIcon] = createSignal<IconPosition>('none');

  const name = () => label().trim() || 'New';

  const code = createMemo(() => {
    const attrs = [
      variant() !== 'soft' ? ` variant="${variant()}"` : '',
      status() !== 'notice' ? ` status="${status()}"` : '',
      size() !== 'default' ? ` size="${size()}"` : '',
    ].join('');
    const text = name();
    const content = /[&<>{}]/.test(text)
      ? `{'${JSON.stringify(text).slice(1, -1).replaceAll('\\"', '"').replaceAll("'", "\\'")}'}`
      : text;
    const iconCode = '<Icon icon={cdxIconStar} />';

    if (icon() === 'none') {
      return `<Badge${attrs}>${content}</Badge>`;
    }

    const children = icon() === 'start' ? [iconCode, content] : [content, iconCode];

    return `<Badge${attrs}>\n  ${children.join('\n  ')}\n</Badge>`;
  });

  return (
    <PreviewFrame class="playground @container">
      <div class="grid grid-cols-1 @min-[35rem]:grid-cols-[minmax(0,1fr)_15rem]">
        <Preview kind="playground">
          <Badge variant={variant()} status={status()} size={size()}>
            <Show when={icon() === 'start'}>
              <Icon icon={cdxIconStar} />
            </Show>
            {name()}
            <Show when={icon() === 'end'}>
              <Icon icon={cdxIconStar} />
            </Show>
          </Badge>
        </Preview>
        <div
          class="
            flex flex-col gap-4 p-5 bg-surface-neutral-subtle border-t border-line-subtle
            @min-[35rem]:border-t-0 @min-[35rem]:border-l
          "
        >
          <Field label="Variant" for="badge-variant">
            <select
              id="badge-variant"
              class={fieldControlClasses}
              value={variant()}
              onChange={(e) => setVariant(e.currentTarget.value as BadgeVariant)}
            >
              <For each={variants}>{(value) => <option value={value}>{value}</option>}</For>
            </select>
          </Field>
          <Field label="Status" for="badge-status">
            <select
              id="badge-status"
              class={fieldControlClasses}
              value={status()}
              onChange={(e) => setStatus(e.currentTarget.value as BadgeStatus)}
            >
              <For each={statuses}>{(value) => <option value={value}>{value}</option>}</For>
            </select>
          </Field>
          <Field label="Size" for="badge-size">
            <select
              id="badge-size"
              class={fieldControlClasses}
              value={size()}
              onChange={(e) => setSize(e.currentTarget.value as BadgeSize)}
            >
              <For each={sizes}>{(value) => <option value={value}>{value}</option>}</For>
            </select>
          </Field>
          <Field label="Label" for="badge-label">
            <input
              id="badge-label"
              class={fieldControlClasses}
              value={label()}
              onInput={(e) => setLabel(e.currentTarget.value)}
            />
          </Field>
          <Field label="Icon" for="badge-icon">
            <select
              id="badge-icon"
              class={fieldControlClasses}
              value={icon()}
              onChange={(e) => setIcon(e.currentTarget.value as IconPosition)}
            >
              <option value="none">None</option>
              <option value="start">Before label</option>
              <option value="end">After label</option>
            </select>
          </Field>
        </div>
      </div>
      <CodeBlock code={code()} />
    </PreviewFrame>
  );
}

export const badgeVariantsExample = {
  component: BadgeVariantsDemo,
  source: variantsSource,
};

export const badgeStatusesExample = {
  component: BadgeStatusesDemo,
  source: statusesSource,
};

export const badgeSizesExample = {
  component: BadgeSizesDemo,
  source: sizesSource,
};

export const badgeWithIconsExample = {
  component: BadgeWithIconsDemo,
  source: withIconsSource,
};

export const badgeLinkExample = {
  component: BadgeLinkDemo,
  source: linkSource,
};

export const badgeCustomColorsExample = {
  component: BadgeCustomColorsDemo,
  source: customColorsSource,
};
