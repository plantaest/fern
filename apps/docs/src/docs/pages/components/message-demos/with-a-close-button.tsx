import { Button } from '@taxonlabs/fern/button';
import { Message } from '@taxonlabs/fern/message';
import { createEffect, createSignal, Show } from 'solid-js';

export default function MessageWithACloseButtonDemo() {
  const [visible, setVisible] = createSignal(true);
  let showButton: HTMLButtonElement | undefined;

  createEffect(visible, (isVisible) => {
    if (!isVisible) {
      showButton?.focus();
    }
  });

  return (
    <Show
      when={visible()}
      fallback={
        <Button ref={showButton} variant="outline" onClick={() => setVisible(true)}>
          Show message
        </Button>
      }
    >
      <Message
        class="w-full max-w-md"
        variant="solid"
        type="success"
        withCloseButton
        onClose={() => setVisible(false)}
      >
        Your watchlist was updated.
      </Message>
    </Show>
  );
}
