import { Button } from '@taxon-labs/fern/button';
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
import { Example } from '../../docs';

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
    <>
      <div
        class="
          grid grid-cols-4 border-t border-l border-line rounded-fern
          overflow-hidden mb-5 docs-mobile:grid-cols-3
        "
      >
        <For each={galleryIcons}>
          {(item) => (
            <div
              class="
                min-h-28 flex items-center justify-center flex-col
                gap-4 border-r border-b border-line text-[12px]
                text-muted
              "
            >
              <Icon icon={item.icon} class="text-content" />
              <span>{item.name}</span>
            </div>
          )}
        </For>
      </div>
      <p class="text-[13px] leading-5 text-muted">
        Explore the{' '}
        <a href="https://doc.wikimedia.org/codex/latest/icons/all-icons.html">
          full Codex icon collection
        </a>
        .
      </p>
    </>
  );
}

export function IconsInUse() {
  return (
    <Example
      title="Labeled and icon-only buttons"
      code={`import { cdxIconEdit } from '@wikimedia/codex-icons';

<Button variant="outline">
  <Icon icon={cdxIconEdit} />
  Edit
</Button>

<Button variant="outline" size="icon" aria-label="Edit">
  <Icon icon={cdxIconEdit} />
</Button>`}
    >
      <Button variant="outline">
        <Icon icon={cdxIconEdit} />
        Edit
      </Button>
      <Button variant="outline" size="icon" aria-label="Edit">
        <Icon icon={cdxIconEdit} />
      </Button>
    </Example>
  );
}
