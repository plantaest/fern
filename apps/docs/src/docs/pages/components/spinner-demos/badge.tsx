import { Badge } from '@taxonlabs/fern/badge';
import { Spinner } from '@taxonlabs/fern/spinner';

export default function SpinnerBadgeDemo() {
  return (
    <>
      <Badge status="progressive" size="sm">
        <Spinner size="xs" aria-hidden="true" />
        Syncing…
      </Badge>
      <Badge status="progressive">
        <Spinner size="sm" aria-hidden="true" />
        Syncing…
      </Badge>
      <Badge status="progressive" size="lg">
        <Spinner aria-hidden="true" />
        Syncing…
      </Badge>
    </>
  );
}
