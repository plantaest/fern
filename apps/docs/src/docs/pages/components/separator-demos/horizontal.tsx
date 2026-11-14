import { Separator } from '@taxonlabs/fern/separator';

export default function SeparatorHorizontalDemo() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-3 text-small">
      <div>
        <p class="font-semibold">Search filters</p>
        <p class="text-content-subtle">Main namespace · Recently edited</p>
      </div>
      <Separator />
      <div>
        <p class="font-semibold">Search results</p>
        <p class="text-content-subtle">12 matching articles</p>
      </div>
    </div>
  );
}
