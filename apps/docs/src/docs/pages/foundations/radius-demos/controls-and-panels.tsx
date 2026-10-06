import { Button } from '@taxon-labs/fern/button';

export default function RadiusControlsDemo() {
  return (
    <div
      class="
        flex gap-8 items-center text-small flex-wrap rounded-base
        border border-line-subtle p-6
      "
    >
      <span>Panel content</span>
      <Button variant="outline">Edit</Button>
    </div>
  );
}
