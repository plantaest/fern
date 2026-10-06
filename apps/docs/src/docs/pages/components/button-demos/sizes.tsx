import { Button } from '@taxon-labs/fern/button';
import { Icon } from '@taxon-labs/fern/icon';
import { cdxIconEdit } from '@wikimedia/codex-icons';

export default function ButtonSizesDemo() {
  return (
    <>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Small
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Edit">
          <Icon icon={cdxIconEdit} />
        </Button>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline">Default</Button>
        <Button variant="outline" size="icon" aria-label="Edit">
          <Icon icon={cdxIconEdit} />
        </Button>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button variant="outline" size="icon-lg" aria-label="Edit">
          <Icon icon={cdxIconEdit} />
        </Button>
      </div>
    </>
  );
}
