import { Progress } from '@taxonlabs/fern/progress';

export default function ProgressBasicUsageDemo() {
  return <Progress class="max-w-sm" value={60} aria-label="Export progress" />;
}
