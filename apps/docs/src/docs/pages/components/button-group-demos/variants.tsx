import { Button, type ButtonVariant } from '@taxonlabs/fern/button';
import { ButtonGroup } from '@taxonlabs/fern/button-group';
import { createSignal, For } from 'solid-js';

const variants = ['solid', 'soft', 'surface', 'outline', 'ghost'] satisfies ButtonVariant[];

export default function ButtonGroupVariantsDemo() {
  const [disabled, setDisabled] = createSignal(false);

  return (
    <div class="grid grid-cols-[auto_auto] items-center gap-4">
      <For each={variants}>
        {(variant) => (
          <>
            <span class="text-extra-small text-content-subtle capitalize">{variant}</span>
            <ButtonGroup aria-label={`Export results (${variant})`} class="justify-self-start">
              <Button variant={variant} disabled={disabled()}>
                CSV
              </Button>
              <Button variant={variant} disabled={disabled()}>
                TSV
              </Button>
              <Button variant={variant} disabled={disabled()}>
                JSON
              </Button>
            </ButtonGroup>
          </>
        )}
      </For>

      <label class="text-small col-span-full flex items-center gap-2 justify-self-center">
        <input
          type="checkbox"
          checked={disabled()}
          onChange={(event) => setDisabled(event.currentTarget.checked)}
        />
        Disable buttons
      </label>
    </div>
  );
}
