import { Button, type ButtonVariant } from '@taxonlabs/fern/button';
import { ButtonGroup } from '@taxonlabs/fern/button-group';
import { For } from 'solid-js';

const variants = ['solid', 'soft', 'surface', 'outline', 'ghost'] satisfies ButtonVariant[];

export default function ButtonGroupVariantsDemo() {
  return (
    <div class="grid grid-cols-[auto_auto] items-center gap-4">
      <For each={variants}>
        {(variant) => (
          <>
            <span class="text-extra-small text-content-subtle capitalize">{variant}</span>
            <ButtonGroup aria-label={`Export results (${variant})`} class="justify-self-start">
              <Button variant={variant}>CSV</Button>
              <Button variant={variant}>TSV</Button>
              <Button variant={variant}>JSON</Button>
            </ButtonGroup>
          </>
        )}
      </For>
    </div>
  );
}
