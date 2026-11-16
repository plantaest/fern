import { Icon } from '@taxonlabs/fern/icon';
import { ToggleButtonGroup, ToggleButtonGroupItem } from '@taxonlabs/fern/toggle-button-group';
import {
  cdxIconImageLayoutBasic,
  cdxIconImageLayoutFrame,
  cdxIconImageLayoutFrameless,
  cdxIconImageLayoutThumbnail,
} from '@wikimedia/codex-icons';
import { createSignal, For, Show } from 'solid-js';

const layouts = [
  { value: 'basic', label: 'Basic', icon: cdxIconImageLayoutBasic },
  { value: 'framed', label: 'Framed', icon: cdxIconImageLayoutFrame },
  { value: 'frameless', label: 'Frameless', icon: cdxIconImageLayoutFrameless },
  { value: 'thumbnail', label: 'Thumbnail', icon: cdxIconImageLayoutThumbnail },
];

export default function ToggleButtonGroupCustomDemo() {
  const [layout, setLayout] = createSignal('basic');
  const framed = () => layout() === 'framed' || layout() === 'thumbnail';
  const smaller = () => layout() === 'frameless' || layout() === 'thumbnail';

  return (
    <div class="grid w-full max-w-sm justify-items-center gap-4">
      <ToggleButtonGroup
        aria-label="Image layout"
        variant="ghost"
        class="grid w-full grid-cols-4 gap-2 screen-small:grid-cols-2"
        value={layout()}
        onChange={(value) => setLayout(value ?? 'basic')}
      >
        <For each={layouts}>
          {(option) => (
            <ToggleButtonGroupItem value={option.value} class="h-auto flex-col gap-2 px-2 py-2">
              <Icon icon={option.icon} />
              {option.label}
            </ToggleButtonGroupItem>
          )}
        </For>
      </ToggleButtonGroup>
      <div class="grid min-h-40 w-full place-items-center">
        <figure class={['m-0', framed() && 'rounded-base border border-line-subtle p-2']}>
          <div
            aria-hidden="true"
            class={['aspect-video rounded-base bg-surface-neutral', smaller() ? 'w-32' : 'w-48']}
          />
          <Show when={framed()}>
            <figcaption class="mt-1 text-extra-small text-content-subtle">Caption</figcaption>
          </Show>
        </figure>
      </div>
    </div>
  );
}
