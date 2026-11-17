import { Spinner } from '@taxonlabs/fern/spinner';

export default function SpinnerCustomSizeDemo() {
  return (
    <div
      class="
        grid min-h-40 w-full max-w-md place-items-center
        rounded-base border border-line-subtle bg-surface-neutral-subtle
      "
    >
      <Spinner class="size-8 text-content-progressive" aria-label="Loading search results" />
    </div>
  );
}
