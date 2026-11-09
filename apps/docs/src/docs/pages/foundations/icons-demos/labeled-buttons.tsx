import { Button } from '@taxonlabs/fern/button';
import { Icon } from '@taxonlabs/fern/icon';
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
