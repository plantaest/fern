import { For } from 'solid-js';
import SpacingActionsDemo from './spacing-demos/related-actions';
import spacingSource from './spacing-demos/related-actions.tsx?raw';

const spacing = [4, 8, 12, 16, 24, 32, 48];

export function SpacingScale() {
  return (
    <div class="py-2">
      <For each={spacing}>
        {(size) => (
          <div
            class="
              grid grid-cols-[40px_72px_56px_1fr] items-center gap-4 my-5
              text-[0.8125rem] [&_code]:text-muted
            "
          >
            <code>{size / 4}</code>
            <span
              class="inline-block h-6 bg-docs-progressive rounded-base"
              style={{ width: `calc(var(--fern-spacing) * ${size / 4})` }}
            />
            <span>{size}px</span>
            <code>{size / 16}rem</code>
          </div>
        )}
      </For>
    </div>
  );
}

export const spacingInUse = {
  component: SpacingActionsDemo,
  source: spacingSource,
};
