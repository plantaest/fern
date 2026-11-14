import { Separator } from '@taxonlabs/fern/separator';

export default function SeparatorResponsiveDemo() {
  const panel = 'grid min-h-24 flex-1 place-items-center rounded-base bg-surface-neutral-subtle';

  return (
    <div class="flex w-full flex-col gap-3 text-small lg:flex-row">
      <div class={panel}>Source</div>
      <Separator class="lg:hidden" />
      <Separator orientation="vertical" class="hidden lg:block" />
      <div class={panel}>Preview</div>
    </div>
  );
}
