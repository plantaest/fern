import type { ButtonSize } from '@taxonlabs/fern/button';
import { Icon } from '@taxonlabs/fern/icon';
import { ToggleButton, type ToggleButtonVariant } from '@taxonlabs/fern/toggle-button';
import { cdxIconBookmark } from '@wikimedia/codex-icons';
import { createSignal, For, Show } from 'solid-js';
import { CodeBlock, Field, fieldControlClasses, Preview, PreviewFrame } from '../../ui';
import ToggleButtonChangingTheIconDemo from './toggle-button-demos/changing-the-icon';
import changingTheIconSource from './toggle-button-demos/changing-the-icon.tsx?raw';
import ToggleButtonFormattingDemo from './toggle-button-demos/formatting';
import formattingSource from './toggle-button-demos/formatting.tsx?raw';
import ToggleButtonVariantsDemo from './toggle-button-demos/variants';
import variantsSource from './toggle-button-demos/variants.tsx?raw';

const variants = ['surface', 'ghost'] as const satisfies readonly ToggleButtonVariant[];
const textSizes = ['sm', 'default', 'lg'] as const satisfies readonly ButtonSize[];
type TextSize = (typeof textSizes)[number];
type IconPlacement = 'none' | 'start' | 'only';

export function ToggleButtonPlayground() {
  const [variant, setVariant] = createSignal<ToggleButtonVariant>('surface');
  const [size, setSize] = createSignal<TextSize>('default');
  const [icon, setIcon] = createSignal<IconPlacement>('none');
  const [pressed, setPressed] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);

  const selectedSize = (): ButtonSize => {
    const value = size();

    return icon() === 'only' ? (value === 'default' ? 'icon' : `icon-${value}`) : value;
  };

  const code = () => {
    const attrs = [
      variant() !== 'surface' ? ` variant="${variant()}"` : '',
      selectedSize() !== 'default' ? ` size="${selectedSize()}"` : '',
      icon() === 'only' ? ' aria-label="Bookmark"' : '',
      pressed() ? ' defaultPressed' : '',
      disabled() ? ' disabled' : '',
    ].join('');
    const content = [
      icon() !== 'none' ? '  <Icon icon={cdxIconBookmark} />' : '',
      icon() !== 'only' ? '  Bookmark' : '',
    ]
      .filter(Boolean)
      .join('\n');

    return `<ToggleButton${attrs}>\n${content}\n</ToggleButton>`;
  };

  return (
    <PreviewFrame class="playground @container">
      <div class="grid grid-cols-1 @min-[35rem]:grid-cols-[minmax(0,1fr)_15rem]">
        <Preview kind="playground">
          <ToggleButton
            variant={variant()}
            size={selectedSize()}
            pressed={pressed()}
            disabled={disabled()}
            aria-label={icon() === 'only' ? 'Bookmark' : undefined}
            onPressedChange={setPressed}
          >
            <Show when={icon() !== 'none'}>
              <Icon icon={cdxIconBookmark} />
            </Show>
            <Show when={icon() !== 'only'}>Bookmark</Show>
          </ToggleButton>
        </Preview>
        <div
          class="
            flex flex-col gap-4 p-5 bg-surface-neutral-subtle border-t border-line-subtle
            @min-[35rem]:border-t-0 @min-[35rem]:border-l
          "
        >
          <Field label="Variant" for="toggle-button-variant">
            <select
              id="toggle-button-variant"
              class={fieldControlClasses}
              value={variant()}
              onChange={(event) => setVariant(event.currentTarget.value as ToggleButtonVariant)}
            >
              <For each={variants}>{(value) => <option value={value}>{value}</option>}</For>
            </select>
          </Field>
          <Field label="Size" for="toggle-button-size">
            <select
              id="toggle-button-size"
              class={fieldControlClasses}
              value={size()}
              onChange={(event) => setSize(event.currentTarget.value as TextSize)}
            >
              <For each={textSizes}>{(value) => <option value={value}>{value}</option>}</For>
            </select>
          </Field>
          <Field label="Icon" for="toggle-button-icon">
            <select
              id="toggle-button-icon"
              class={fieldControlClasses}
              value={icon()}
              onChange={(event) => setIcon(event.currentTarget.value as IconPlacement)}
            >
              <option value="none">None</option>
              <option value="start">Before label</option>
              <option value="only">Icon only</option>
            </select>
          </Field>
          <label class="flex items-center gap-2 text-small font-normal">
            <input
              type="checkbox"
              class="size-4 m-0 accent-surface-progressive"
              checked={pressed()}
              onChange={(event) => setPressed(event.currentTarget.checked)}
            />
            Pressed
          </label>
          <label class="flex items-center gap-2 text-small font-normal">
            <input
              type="checkbox"
              class="size-4 m-0 accent-surface-progressive"
              checked={disabled()}
              onChange={(event) => setDisabled(event.currentTarget.checked)}
            />
            Disabled
          </label>
        </div>
      </div>
      <CodeBlock code={code()} />
    </PreviewFrame>
  );
}

export const toggleButtonVariantsExample = {
  component: ToggleButtonVariantsDemo,
  source: variantsSource,
};

export const toggleButtonChangingTheIconExample = {
  component: ToggleButtonChangingTheIconDemo,
  source: changingTheIconSource,
};

export const toggleButtonFormattingExample = {
  component: ToggleButtonFormattingDemo,
  source: formattingSource,
};
