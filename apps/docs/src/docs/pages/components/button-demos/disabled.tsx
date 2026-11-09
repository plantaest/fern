import { Button } from '@taxonlabs/fern/button';

export default function ButtonDisabledDemo() {
  return (
    <>
      <Button disabled>Save changes</Button>
      <Button variant="outline" disabled>
        Unavailable
      </Button>
      <Button disabled aria-busy="true">
        Saving…
      </Button>
    </>
  );
}
