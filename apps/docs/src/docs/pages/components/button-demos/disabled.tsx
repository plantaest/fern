import { Button } from '@taxonlabs/fern/button';

export default function ButtonDisabledDemo() {
  return (
    <>
      <Button disabled>Solid</Button>
      <Button variant="soft" disabled>
        Soft
      </Button>
      <Button variant="surface" disabled>
        Surface
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
    </>
  );
}
