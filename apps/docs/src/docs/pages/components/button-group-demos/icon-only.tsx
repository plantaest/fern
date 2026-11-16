import { Button } from '@taxonlabs/fern/button';
import { ButtonGroup } from '@taxonlabs/fern/button-group';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconZoomIn, cdxIconZoomOut } from '@wikimedia/codex-icons';

export default function ButtonGroupIconOnlyDemo() {
  return (
    <ButtonGroup aria-label="Zoom controls">
      <Button variant="outline" size="icon" aria-label="Zoom out">
        <Icon icon={cdxIconZoomOut} />
      </Button>
      <Button variant="outline" size="icon" aria-label="Zoom in">
        <Icon icon={cdxIconZoomIn} />
      </Button>
    </ButtonGroup>
  );
}
