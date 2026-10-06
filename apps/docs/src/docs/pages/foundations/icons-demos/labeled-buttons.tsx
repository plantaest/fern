import { Button } from '@taxon-labs/fern/button';
import { Icon } from '@taxon-labs/fern/icon';
import { cdxIconEdit } from '@wikimedia/codex-icons';

export default function IconsButtonsDemo() {
  return (
    <>
      <Button variant="outline">
        <Icon icon={cdxIconEdit} />
        Edit
      </Button>
      <Button variant="outline" size="icon" aria-label="Edit">
        <Icon icon={cdxIconEdit} />
      </Button>
    </>
  );
}
