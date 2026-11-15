import { Icon } from '@taxonlabs/fern/icon';
import { ToggleButton } from '@taxonlabs/fern/toggle-button';
import { cdxIconBold } from '@wikimedia/codex-icons';
import { createSignal } from 'solid-js';

export default function ToggleButtonFormattingDemo() {
  const [bold, setBold] = createSignal(false);

  return (
    <div class="flex flex-col items-center gap-3 text-center">
      <ToggleButton
        variant="ghost"
        size="icon"
        aria-label="Bold"
        pressed={bold()}
        onPressedChange={setBold}
      >
        <Icon icon={cdxIconBold} />
      </ToggleButton>
      <p class={bold() ? 'font-bold' : undefined}>The free encyclopedia</p>
    </div>
  );
}
