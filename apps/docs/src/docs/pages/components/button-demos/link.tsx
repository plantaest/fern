import { Button } from '@taxon-labs/fern/button';
import { Icon } from '@taxon-labs/fern/icon';
import { cdxIconArrowNext } from '@wikimedia/codex-icons';

export default function ButtonLinkDemo() {
  return (
    <Button as="a" href="/foundations/colors" variant="outline">
      Explore colors
      <Icon icon={cdxIconArrowNext} />
    </Button>
  );
}
