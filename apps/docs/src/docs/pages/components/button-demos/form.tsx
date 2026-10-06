import { Button } from '@taxon-labs/fern/button';
import { createSignal } from 'solid-js';

export default function ButtonFormDemo() {
  const [message, setMessage] = createSignal('No form submission yet');

  return (
    <form
      class="flex flex-col gap-3 items-center"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage('Form submitted');
      }}
    >
      <div class="flex gap-2">
        <Button action="progressive" type="submit">
          Submit
        </Button>
        <Button variant="outline" onClick={() => setMessage('Preview opened — form not submitted')}>
          Preview
        </Button>
      </div>
      <span class="text-small-xs text-content-subtle" role="status">
        {message()}
      </span>
    </form>
  );
}
