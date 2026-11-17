import { Button } from '@taxonlabs/fern/button';
import { Spinner } from '@taxonlabs/fern/spinner';

export default function SpinnerButtonDemo() {
  return (
    <>
      <Button size="sm" disabled aria-busy="true">
        <Spinner size="sm" aria-hidden="true" />
        Saving…
      </Button>
      <Button disabled aria-busy="true">
        <Spinner aria-hidden="true" />
        Saving…
      </Button>
      <Button size="lg" disabled aria-busy="true">
        <Spinner size="lg" aria-hidden="true" />
        Saving…
      </Button>
    </>
  );
}
