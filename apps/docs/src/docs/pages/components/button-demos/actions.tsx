import { Button } from '@taxon-labs/fern/button';

export default function ButtonActionsDemo() {
  return (
    <>
      <Button variant="surface">Preview</Button>
      <Button variant="surface" action="progressive">
        Continue
      </Button>
      <Button variant="surface" action="destructive">
        Delete draft
      </Button>
    </>
  );
}
