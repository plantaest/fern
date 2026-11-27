import { Progress } from '@taxonlabs/fern/progress';

export default function ProgressCustomRangeDemo() {
  return <Progress class="max-w-sm" value={350} min={200} max={500} aria-label="Review progress" />;
}
