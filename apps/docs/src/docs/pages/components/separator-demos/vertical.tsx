import { Separator } from '@taxonlabs/fern/separator';

export default function SeparatorVerticalDemo() {
  return (
    <nav aria-label="Foundation links" class="flex items-center gap-3 text-small">
      <a class="text-content-progressive" href="/foundations/colors">
        Colors
      </a>
      <Separator orientation="vertical" decorative />
      <a class="text-content-progressive" href="/foundations/typography">
        Typography
      </a>
      <Separator orientation="vertical" decorative />
      <a class="text-content-progressive" href="/foundations/icons">
        Icons
      </a>
    </nav>
  );
}
