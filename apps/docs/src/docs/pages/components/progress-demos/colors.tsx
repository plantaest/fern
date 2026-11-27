import { Progress, ProgressLabel } from '@taxonlabs/fern/progress';

export default function ProgressColorsDemo() {
  return (
    <div class="grid w-full max-w-sm gap-4 text-small">
      <Progress class="grid gap-2" value={60}>
        <ProgressLabel>Progressive</ProgressLabel>
      </Progress>
      <Progress class="grid gap-2" value={60} color="success">
        <ProgressLabel>Success</ProgressLabel>
      </Progress>
      <Progress class="grid gap-2" value={60} color="warning">
        <ProgressLabel>Warning</ProgressLabel>
      </Progress>
      <Progress class="grid gap-2" value={60} color="error">
        <ProgressLabel>Error</ProgressLabel>
      </Progress>
    </div>
  );
}
