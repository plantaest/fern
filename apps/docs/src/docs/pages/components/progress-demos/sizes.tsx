import { Progress, ProgressLabel } from '@taxonlabs/fern/progress';

export default function ProgressSizesDemo() {
  return (
    <div class="grid w-full max-w-sm gap-4 text-small">
      <Progress class="grid gap-2" value={60} size="sm">
        <ProgressLabel>Small</ProgressLabel>
      </Progress>
      <Progress class="grid gap-2" value={60}>
        <ProgressLabel>Default</ProgressLabel>
      </Progress>
      <Progress class="grid gap-2" value={60} size="lg">
        <ProgressLabel>Large</ProgressLabel>
      </Progress>
    </div>
  );
}
