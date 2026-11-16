import type { ButtonSize } from '@taxonlabs/fern/button';
import { ToggleButtonGroup, ToggleButtonGroupItem } from '@taxonlabs/fern/toggle-button-group';
import { For } from 'solid-js';

const sizes = ['sm', 'default', 'lg'] satisfies ButtonSize[];

export default function ToggleButtonGroupSizesDemo() {
  return (
    <div class="grid grid-cols-[auto_auto] items-center gap-3 screen-tiny:grid-cols-1">
      <For each={sizes}>
        {(size) => (
          <>
            <span class="text-extra-small text-content-subtle">{size}</span>
            <ToggleButtonGroup
              aria-label={`Page type (${size})`}
              size={size}
              class="justify-self-start"
            >
              <ToggleButtonGroupItem value="article">Article</ToggleButtonGroupItem>
              <ToggleButtonGroupItem value="talk">Talk</ToggleButtonGroupItem>
              <ToggleButtonGroupItem value="help">Help</ToggleButtonGroupItem>
            </ToggleButtonGroup>
          </>
        )}
      </For>
    </div>
  );
}
