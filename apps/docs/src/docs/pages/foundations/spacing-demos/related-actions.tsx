import { Button } from '@taxon-labs/fern/button';

export default function SpacingActionsDemo() {
  return (
    <div class="flex gap-2">
      <Button action="progressive">Save</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  );
}
