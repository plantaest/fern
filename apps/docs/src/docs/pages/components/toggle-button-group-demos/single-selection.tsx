import { ToggleButtonGroup, ToggleButtonGroupItem } from '@taxonlabs/fern/toggle-button-group';
import { createSignal, For } from 'solid-js';

const pages = [
  { type: 'article', title: 'Hanoi' },
  { type: 'talk', title: 'Talk:Hanoi' },
  { type: 'help', title: 'Help:Editing' },
];

export default function ToggleButtonGroupSingleSelectionDemo() {
  const [type, setType] = createSignal<string | null>(null);

  return (
    <div class="grid w-full max-w-56 justify-items-center gap-3">
      <ToggleButtonGroup aria-label="Page type" value={type()} onChange={setType}>
        <ToggleButtonGroupItem value="article">Article</ToggleButtonGroupItem>
        <ToggleButtonGroupItem value="talk">Talk</ToggleButtonGroupItem>
        <ToggleButtonGroupItem value="help">Help</ToggleButtonGroupItem>
      </ToggleButtonGroup>
      <ul
        aria-label="Results"
        class="
          m-0 w-full list-none divide-y divide-line-subtle overflow-hidden
          rounded-base border border-line-subtle p-0 text-small
        "
      >
        <For each={pages}>
          {(page) => (
            <li class={['px-3 py-2', type() === page.type && 'bg-surface-progressive-subtle']}>
              {page.title}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
