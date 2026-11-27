import { Button } from '@taxonlabs/fern/button';
import { Progress, ProgressLabel, ProgressValue } from '@taxonlabs/fern/progress';
import { createSignal } from 'solid-js';

export default function ProgressWithLabelAndValueDemo() {
  const total = 120;
  const initialCount = 42;
  const [processed, setProcessed] = createSignal(initialCount);

  return (
    <div class="grid w-full max-w-sm gap-3">
      <Progress
        class="grid gap-2"
        value={processed()}
        max={total}
        getValueLabel={({ value, max }) => `${value} / ${max}`}
      >
        <div class="flex flex-wrap justify-between gap-x-2 text-small">
          <ProgressLabel>Pages processed</ProgressLabel>
          <ProgressValue class="tabular-nums" />
        </div>
      </Progress>
      <div class="flex flex-wrap gap-2">
        <Button
          variant="surface"
          disabled={processed() === total}
          onClick={() => setProcessed((count) => Math.min(count + 20, total))}
        >
          Process next batch
        </Button>
        <Button variant="ghost" onClick={() => setProcessed(initialCount)}>
          Reset
        </Button>
      </div>
    </div>
  );
}
