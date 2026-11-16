import { Icon } from '@taxonlabs/fern/icon';
import { ToggleButtonGroup, ToggleButtonGroupItem } from '@taxonlabs/fern/toggle-button-group';
import { cdxIconBold, cdxIconItalic, cdxIconUnderline } from '@wikimedia/codex-icons';
import { createSignal } from 'solid-js';

export default function ToggleButtonGroupMultipleSelectionDemo() {
  const [formats, setFormats] = createSignal(['bold', 'italic']);

  return (
    <div class="flex w-full max-w-xs gap-3">
      <ToggleButtonGroup
        aria-label="Text formatting"
        orientation="vertical"
        size="icon"
        multiple
        value={formats()}
        onChange={setFormats}
      >
        <ToggleButtonGroupItem value="bold" aria-label="Bold">
          <Icon icon={cdxIconBold} />
        </ToggleButtonGroupItem>
        <ToggleButtonGroupItem value="italic" aria-label="Italic">
          <Icon icon={cdxIconItalic} />
        </ToggleButtonGroupItem>
        <ToggleButtonGroupItem value="underline" aria-label="Underline">
          <Icon icon={cdxIconUnderline} />
        </ToggleButtonGroupItem>
      </ToggleButtonGroup>
      <p
        class="
          m-0 grid min-w-0 flex-1 place-items-center rounded-base border
          border-line-subtle p-3 text-center text-small
        "
        style={{
          'font-weight': formats().includes('bold') ? 'var(--fern-font-weight-bold)' : undefined,
          'font-style': formats().includes('italic') ? 'italic' : undefined,
          'text-decoration-line': formats().includes('underline') ? 'underline' : undefined,
        }}
      >
        The free encyclopedia
      </p>
    </div>
  );
}
