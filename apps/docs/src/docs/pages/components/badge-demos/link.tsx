import { Badge } from '@taxonlabs/fern/badge';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconArrowNext } from '@wikimedia/codex-icons';

export default function BadgeLinkDemo() {
  return (
    <Badge as="a" href="/foundations/colors" variant="solid" status="progressive">
      Color tokens
      <Icon icon={cdxIconArrowNext} />
    </Badge>
  );
}
