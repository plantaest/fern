import { Button } from '@taxonlabs/fern/button';
import { Spinner } from '@taxonlabs/fern/spinner';

export default function ButtonLoadingDemo() {
  return (
    <>
      <Button disabled aria-busy="true">
        <Spinner aria-hidden="true" />
        Saving…
      </Button>
      <Button variant="surface" disabled aria-busy="true">
        <Spinner aria-hidden="true" />
        Saving…
      </Button>
      <Button variant="outline" disabled aria-busy="true">
        <Spinner aria-hidden="true" />
        Saving…
      </Button>
    </>
  );
}
