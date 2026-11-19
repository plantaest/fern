import { Button } from '@taxonlabs/fern/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@taxonlabs/fern/collapsible';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconAdd, cdxIconSubtract } from '@wikimedia/codex-icons';
import { createSignal } from 'solid-js';

const controlClass =
  'h-8 min-w-0 rounded-base border border-line-base bg-surface-base px-2 text-small';

export default function CollapsibleSearchFiltersDemo() {
  const [open, setOpen] = createSignal(false);

  return (
    <Collapsible
      open={open()}
      onOpenChange={setOpen}
      class="w-full max-w-md text-small screen-small:self-start"
    >
      <div class="flex flex-wrap items-end gap-2">
        <label class="grid min-w-32 flex-1 gap-1">
          Search terms
          <input type="search" class={controlClass} />
        </label>
        <CollapsibleTrigger as={Button} variant="outline">
          <Icon icon={open() ? cdxIconSubtract : cdxIconAdd} />
          More filters
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent class="grid gap-3 pt-3">
        <label class="grid gap-1">
          Namespace
          <select class={controlClass}>
            <option>All namespaces</option>
            <option>Article</option>
            <option>Talk</option>
            <option>Help</option>
          </select>
        </label>
        <label class="grid gap-1">
          Exclude words
          <input type="text" class={controlClass} />
        </label>
      </CollapsibleContent>
    </Collapsible>
  );
}
