import { Icon } from '@taxon-labs/fern/icon';
import {
  cdxIconAdd,
  cdxIconArrowNext,
  cdxIconArticle,
  cdxIconCheck,
  cdxIconClose,
  cdxIconCopy,
  cdxIconDownload,
  cdxIconEdit,
  cdxIconSearch,
  cdxIconSettings,
  cdxIconTrash,
  cdxIconUserAvatar,
} from '@wikimedia/codex-icons';
import { For } from 'solid-js';
import IconsButtonsDemo from './icons-demos/labeled-buttons';
import iconsSource from './icons-demos/labeled-buttons.tsx?raw';

export const galleryIcons = [
  { name: 'Add', icon: cdxIconAdd },
  { name: 'Edit', icon: cdxIconEdit },
  { name: 'Search', icon: cdxIconSearch },
  { name: 'Check', icon: cdxIconCheck },
  { name: 'Close', icon: cdxIconClose },
  { name: 'Copy', icon: cdxIconCopy },
  { name: 'Article', icon: cdxIconArticle },
  { name: 'User', icon: cdxIconUserAvatar },
  { name: 'Settings', icon: cdxIconSettings },
  { name: 'Trash', icon: cdxIconTrash },
  { name: 'Download', icon: cdxIconDownload },
  { name: 'Next', icon: cdxIconArrowNext },
];

export function IconsGallery() {
  return (
    <div
      class="
        grid grid-cols-4 border-t border-l border-line-subtle rounded-base
        overflow-hidden screen-small:grid-cols-3
      "
    >
      <For each={galleryIcons}>
        {(item) => (
          <div
            class="
              min-h-28 flex items-center justify-center flex-col
              gap-4 border-r border-b border-line-subtle text-extra-small
              text-content-subtle
            "
          >
            <Icon icon={item.icon} class="text-content-base" />
            <span>{item.name}</span>
          </div>
        )}
      </For>
    </div>
  );
}

export const iconsInUse = {
  component: IconsButtonsDemo,
  source: iconsSource,
};
