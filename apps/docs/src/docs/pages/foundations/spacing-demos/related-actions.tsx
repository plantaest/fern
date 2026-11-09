import { Button } from '@taxonlabs/fern/button';

export default function SpacingActionsDemo() {
  return (
    <div class="flex gap-2">
      <Button action="progressive">Save</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  );
}
