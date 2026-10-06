import { Button } from '@taxon-labs/fern/button';
import { Icon } from '@taxon-labs/fern/icon';
import { cdxIconTrash } from '@wikimedia/codex-icons';

export default function ButtonDestructiveDemo() {
  return (
    <>
      <Button action="destructive">
        <Icon icon={cdxIconTrash} />
        Delete draft
      </Button>
      <Button variant="outline" action="destructive">
        Delete draft
      </Button>
      <Button variant="ghost" action="destructive">
        Delete draft
      </Button>
    </>
  );
}
