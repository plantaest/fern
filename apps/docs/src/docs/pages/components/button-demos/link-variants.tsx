import { buttonVariants } from '@taxon-labs/fern/button';
import { Icon } from '@taxon-labs/fern/icon';
import { cdxIconArrowNext } from '@wikimedia/codex-icons';

export default function ButtonLinkVariantsDemo() {
  return (
    <a href="/foundations/colors" class={buttonVariants({ variant: 'outline' })}>
      Explore colors
      <Icon icon={cdxIconArrowNext} />
    </a>
  );
}
