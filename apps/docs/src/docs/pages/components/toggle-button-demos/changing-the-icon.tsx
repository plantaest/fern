import { Icon } from '@taxonlabs/fern/icon';
import { ToggleButton } from '@taxonlabs/fern/toggle-button';
import { cdxIconBookmark, cdxIconBookmarkOutline } from '@wikimedia/codex-icons';

export default function ToggleButtonChangingTheIconDemo() {
  return (
    <ToggleButton variant="ghost" class="group/toggle">
      <Icon icon={cdxIconBookmarkOutline} class="group-aria-pressed/toggle:hidden" />
      <Icon icon={cdxIconBookmark} class="hidden group-aria-pressed/toggle:inline-block" />
      Bookmark
    </ToggleButton>
  );
}
