import { buttonVariants } from '@taxonlabs/fern/button';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconArrowNext } from '@wikimedia/codex-icons';

export default function ButtonLinkVariantsDemo() {
  return (
    <a href="/foundations/colors" class={buttonVariants({ variant: 'outline' })}>
      Explore colors
      <Icon icon={cdxIconArrowNext} />
    </a>
  );
}
