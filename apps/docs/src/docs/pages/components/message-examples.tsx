import { Button } from '@taxonlabs/fern/button';
import { Message, type MessageType, type MessageVariant } from '@taxonlabs/fern/message';
import { cdxIconArticle } from '@wikimedia/codex-icons';
import { createEffect, createSignal, For, Show } from 'solid-js';
import { CodeBlock, Field, fieldControlClasses, Preview, PreviewFrame } from '../../ui';
import MessageInlineValidationDemo from './message-demos/inline-validation';
import inlineValidationSource from './message-demos/inline-validation.tsx?raw';
import MessageTypesDemo from './message-demos/types';
import typesSource from './message-demos/types.tsx?raw';
import MessageVariantsDemo from './message-demos/variants';
import variantsSource from './message-demos/variants.tsx?raw';
import MessageWithACloseButtonDemo from './message-demos/with-a-close-button';
import withACloseButtonSource from './message-demos/with-a-close-button.tsx?raw';
import MessageWithACustomIconDemo from './message-demos/with-a-custom-icon';
import withACustomIconSource from './message-demos/with-a-custom-icon.tsx?raw';
import MessageWithATitleDemo from './message-demos/with-a-title';
import withATitleSource from './message-demos/with-a-title.tsx?raw';

const variants = ['solid', 'soft', 'surface', 'outline', 'ghost'] satisfies MessageVariant[];

const messageText = {
  notice: 'This draft is only visible to you.',
  success: 'Your changes were saved.',
  warning: 'This page has changed since you opened it.',
  error: 'Could not load search results.',
} satisfies Record<MessageType, string>;

export function MessagePlayground() {
  const [variant, setVariant] = createSignal<MessageVariant>('surface');
  const [type, setType] = createSignal<MessageType>('notice');
  const [inline, setInline] = createSignal(false);
  const [title, setTitle] = createSignal('');
  const [editedText, setEditedText] = createSignal<string>();
  const [useArticleIcon, setUseArticleIcon] = createSignal(false);
  const [withCloseButton, setWithCloseButton] = createSignal(false);
  const [closed, setClosed] = createSignal(false);
  let showButton: HTMLButtonElement | undefined;

  const text = () => editedText() ?? messageText[type()];
  const canClose = () => !inline() && withCloseButton();

  createEffect(closed, (isClosed) => {
    if (isClosed) showButton?.focus();
  });

  const code = () => {
    const variantAttr = inline() || variant() === 'surface' ? '' : ` variant="${variant()}"`;
    const typeAttr = type() === 'notice' ? '' : ` type="${type()}"`;
    const inlineAttr = inline() ? ' inline' : '';
    const titleValue = title();
    const titleCode = /["&<>\r\n\t\u2028\u2029]/.test(titleValue)
      ? `{${JSON.stringify(titleValue)}}`
      : `"${titleValue}"`;
    const titleAttr = titleValue ? ` title=${titleCode}` : '';
    const iconAttr = useArticleIcon() ? ' icon={cdxIconArticle}' : '';
    const closeAttr = canClose() ? ' withCloseButton onClose={() => setVisible(false)}' : '';
    const content = /[&<>{}]|^\s|\s$|\s{2}/.test(text()) ? `{${JSON.stringify(text())}}` : text();
    const iconImport = useArticleIcon()
      ? "import { cdxIconArticle } from '@wikimedia/codex-icons';\n\n"
      : '';
    const attrs = variantAttr + typeAttr + inlineAttr + titleAttr + iconAttr + closeAttr;
    const message = `<Message${attrs}>\n  ${content}\n</Message>`;

    if (!canClose()) return iconImport + message;

    return `import { Message } from '@taxonlabs/fern/message';
import { createSignal, Show } from 'solid-js';
${iconImport.trimEnd() ? `\n${iconImport.trimEnd()}\n` : ''}
function Example() {
  const [visible, setVisible] = createSignal(true);

  return (
    <Show when={visible()}>
${message.replace(/^/gm, '      ')}
    </Show>
  );
}`;
  };

  return (
    <PreviewFrame class="playground @container">
      <div class="grid grid-cols-1 @min-[35rem]:grid-cols-[minmax(0,1fr)_15rem]">
        <Preview kind="playground">
          <Show
            when={!closed()}
            fallback={
              <Button ref={showButton} variant="outline" onClick={() => setClosed(false)}>
                Show message
              </Button>
            }
          >
            <Message
              class="w-full"
              variant={variant()}
              type={type()}
              inline={inline()}
              title={title()}
              icon={useArticleIcon() ? cdxIconArticle : undefined}
              withCloseButton={canClose()}
              onClose={() => setClosed(true)}
              role="none"
              aria-live="off"
            >
              {text()}
            </Message>
          </Show>
        </Preview>
        <div
          class="
            flex flex-col gap-4 p-5 bg-surface-neutral-subtle border-t border-line-subtle
            @min-[35rem]:border-t-0 @min-[35rem]:border-l
          "
        >
          <Field label="Variant" for="message-variant">
            <select
              id="message-variant"
              class={fieldControlClasses}
              value={variant()}
              disabled={inline()}
              onChange={(event) => setVariant(event.currentTarget.value as MessageVariant)}
            >
              <For each={variants}>{(name) => <option value={name}>{name}</option>}</For>
            </select>
          </Field>
          <Field label="Type" for="message-type">
            <select
              id="message-type"
              class={fieldControlClasses}
              value={type()}
              onChange={(event) => setType(event.currentTarget.value as MessageType)}
            >
              <For each={Object.keys(messageText)}>
                {(name) => <option value={name}>{name}</option>}
              </For>
            </select>
          </Field>
          <Field label="Title" for="message-title">
            <input
              id="message-title"
              class={fieldControlClasses}
              value={title()}
              onInput={(event) => setTitle(event.currentTarget.value)}
            />
          </Field>
          <Field label="Message text" for="message-text">
            <input
              id="message-text"
              class={fieldControlClasses}
              value={text()}
              onInput={(event) => setEditedText(event.currentTarget.value)}
            />
          </Field>
          <label class="flex items-center gap-2 text-small font-normal">
            <input
              class="size-4 m-0 accent-surface-progressive"
              type="checkbox"
              checked={inline()}
              onChange={(event) => setInline(event.currentTarget.checked)}
            />
            Inline
          </label>
          <label class="flex items-center gap-2 text-small font-normal">
            <input
              class="size-4 m-0 accent-surface-progressive"
              type="checkbox"
              checked={useArticleIcon()}
              onChange={(event) => setUseArticleIcon(event.currentTarget.checked)}
            />
            Use article icon
          </label>
          <label class="flex items-center gap-2 text-small font-normal">
            <input
              class="size-4 m-0 accent-surface-progressive"
              type="checkbox"
              checked={withCloseButton()}
              disabled={inline()}
              onChange={(event) => setWithCloseButton(event.currentTarget.checked)}
            />
            With close button
          </label>
        </div>
      </div>
      <CodeBlock code={code()} />
    </PreviewFrame>
  );
}

export const messageVariantsExample = {
  component: MessageVariantsDemo,
  source: variantsSource,
};

export const messageTypesExample = {
  component: MessageTypesDemo,
  source: typesSource,
};

export const messageWithATitleExample = {
  component: MessageWithATitleDemo,
  source: withATitleSource,
};

export const messageWithACustomIconExample = {
  component: MessageWithACustomIconDemo,
  source: withACustomIconSource,
};

export const messageInlineValidationExample = {
  component: MessageInlineValidationDemo,
  source: inlineValidationSource,
};

export const messageWithACloseButtonExample = {
  component: MessageWithACloseButtonDemo,
  source: withACloseButtonSource,
};
