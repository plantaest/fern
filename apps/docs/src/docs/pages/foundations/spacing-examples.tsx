import { Button } from '@taxon-labs/fern/button';
import { For } from 'solid-js';
import { Example } from '../../docs';

const spacing = [4, 8, 12, 16, 24, 32, 48];

export function SpacingScale() {
  return (
    <div class="py-2">
      <For each={spacing}>
        {(size) => (
          <div
            class="
              grid grid-cols-[40px_72px_56px_1fr] items-center gap-4 my-5
              text-[13px] [&_code]:text-muted
            "
          >
            <code>{size / 4}</code>
            <span
              class="inline-block h-6 bg-docs-progressive rounded-[2px]"
              style={{ width: `${size}px` }}
            />
            <span>{size}px</span>
            <code>{size / 16}rem</code>
          </div>
        )}
      </For>
    </div>
  );
}

export function SpacingInUse() {
  return (
    <Example
      title="Related actions"
      code={
        '<div class="flex gap-2">\n  <Button>Save</Button>\n  <Button variant="outline">Cancel</Button>\n</div>'
      }
    >
      <div class="flex gap-2">
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </Example>
  );
}
