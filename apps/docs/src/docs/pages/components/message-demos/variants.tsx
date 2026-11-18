import { Message, type MessageVariant } from '@taxonlabs/fern/message';
import { For } from 'solid-js';

const variants = ['solid', 'soft', 'surface', 'outline', 'ghost'] satisfies MessageVariant[];

export default function MessageVariantsDemo() {
  return (
    <div class="grid w-full max-w-md grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
      <For each={variants}>
        {(variant) => (
          <>
            <span class="text-extra-small text-content-subtle capitalize">{variant}</span>
            <Message variant={variant} type="warning">
              This page is protected.
            </Message>
          </>
        )}
      </For>
    </div>
  );
}
