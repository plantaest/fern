import { Message } from '@taxonlabs/fern/message';
import { createSignal, Show } from 'solid-js';

export default function MessageInlineValidationDemo() {
  const [title, setTitle] = createSignal('');
  const invalid = () => title().trim() === '';

  return (
    <div class="grid w-full max-w-xs gap-2 text-small">
      <label class="grid gap-1">
        Article title
        <input
          class="h-8 min-w-0 rounded-base border border-line-base bg-surface-base px-2"
          value={title()}
          aria-invalid={invalid() ? 'true' : undefined}
          aria-describedby={invalid() ? 'article-title-error' : undefined}
          onInput={(event) => setTitle(event.currentTarget.value)}
        />
      </label>
      <Show when={invalid()}>
        <Message id="article-title-error" type="error" inline>
          Enter an article title.
        </Message>
      </Show>
    </div>
  );
}
