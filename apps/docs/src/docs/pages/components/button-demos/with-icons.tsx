import { Button } from '@taxonlabs/fern/button';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconAdd, cdxIconArrowNext, cdxIconDownload } from '@wikimedia/codex-icons';

export default function ButtonWithIconsDemo() {
  return (
    <>
      <Button action="progressive">
        <Icon icon={cdxIconAdd} />
        New article
      </Button>
      <Button variant="outline" action="progressive">
        Continue
        <Icon icon={cdxIconArrowNext} />
      </Button>
      <Button variant="outline" size="icon" aria-label="Download">
        <Icon icon={cdxIconDownload} />
      </Button>
    </>
  );
}
