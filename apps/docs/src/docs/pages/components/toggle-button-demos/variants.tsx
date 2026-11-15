import { ToggleButton } from '@taxonlabs/fern/toggle-button';

export default function ToggleButtonVariantsDemo() {
  return (
    <div class="flex flex-wrap justify-center gap-4">
      <div class="grid justify-items-center gap-2">
        <span class="text-extra-small text-content-subtle">Surface</span>
        <ToggleButton defaultPressed>Bookmark</ToggleButton>
      </div>
      <div class="grid justify-items-center gap-2">
        <span class="text-extra-small text-content-subtle">Ghost</span>
        <ToggleButton variant="ghost" defaultPressed>
          Bookmark
        </ToggleButton>
      </div>
    </div>
  );
}
