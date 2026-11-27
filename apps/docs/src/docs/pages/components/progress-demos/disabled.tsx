import { Progress, ProgressLabel } from '@taxonlabs/fern/progress';

export default function ProgressDisabledDemo() {
  return (
    <div class="grid w-full max-w-sm gap-4 text-small">
      <Progress class="grid gap-2" value={60} disabled>
        <ProgressLabel>Determinate</ProgressLabel>
      </Progress>
      <Progress class="grid gap-2" indeterminate disabled>
        <ProgressLabel>Indeterminate</ProgressLabel>
      </Progress>
    </div>
  );
}
