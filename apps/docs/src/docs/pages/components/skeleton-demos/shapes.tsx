import { Skeleton } from '@taxonlabs/fern/skeleton';

export default function SkeletonShapesDemo() {
  return (
    <div class="flex w-full max-w-xs items-center gap-3">
      <Skeleton class="size-10 shrink-0 rounded-full" />
      <div class="grid flex-1 gap-2">
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-3/4" />
      </div>
    </div>
  );
}
