import { Button } from '@taxonlabs/fern/button';
import { ButtonGroup } from '@taxonlabs/fern/button-group';

export default function ButtonGroupOrientationDemo() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Explore foundations">
      <Button as="a" href="/foundations/colors" variant="outline">
        Colors
      </Button>
      <Button as="a" href="/foundations/typography" variant="outline">
        Typography
      </Button>
      <Button as="a" href="/foundations/spacing" variant="outline">
        Spacing
      </Button>
    </ButtonGroup>
  );
}
