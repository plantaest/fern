import { Progress, ProgressLabel } from '@taxonlabs/fern/progress';

export default function ProgressIndeterminateDemo() {
  return (
    <Progress class="grid w-full max-w-sm gap-2 text-small" indeterminate>
      <ProgressLabel>Preparing export…</ProgressLabel>
    </Progress>
  );
}
