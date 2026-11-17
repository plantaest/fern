import { Button } from '@taxonlabs/fern/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@taxonlabs/fern/collapsible';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconExpand } from '@wikimedia/codex-icons';

export default function CollapsibleRevisionDetailsDemo() {
  return (
    <Collapsible class="w-full max-w-md rounded-base border border-line-subtle text-small">
      <div class="flex items-start justify-between gap-2 p-3">
        <div class="grid gap-1">
          <p class="font-semibold">Hanoi</p>
          <p class="text-content-subtle">
            <time datetime="2025-05-21T14:32:00Z">May 21, 2025, 14:32 UTC</time> · +124 bytes
          </p>
        </div>
        <CollapsibleTrigger
          as={Button}
          variant="ghost"
          size="icon"
          class="group"
          aria-label="Revision details for Hanoi"
        >
          <Icon icon={cdxIconExpand} class="group-aria-expanded:rotate-180" />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent class="grid gap-2 border-t border-line-subtle p-3">
        <p>
          <span class="font-medium">Editor</span> · Example editor
        </p>
        <p>
          <span class="font-medium">Edit summary</span> · Added a source for the population figure.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
