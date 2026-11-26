import { Button } from '@taxonlabs/fern/button';
import { Kbd } from '@taxonlabs/fern/kbd';

export default function KbdWithAButtonDemo() {
  return (
    <Button as="a" href="/foundations/colors" variant="outline">
      View color tokens
      <Kbd size="sm" aria-hidden="true">
        Enter
      </Kbd>
    </Button>
  );
}
