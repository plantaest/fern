import {
  Button,
  type ButtonAction,
  type ButtonSize,
  type ButtonVariant,
  buttonVariants,
} from '@taxon-labs/fern/button';
import { Icon } from '@taxon-labs/fern/icon';
import {
  cdxIconAdd,
  cdxIconArrowNext,
  cdxIconDownload,
  cdxIconEdit,
  cdxIconTrash,
} from '@wikimedia/codex-icons';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { CodeBlock, Example, Field, fieldControlClasses, Preview, PreviewFrame } from '../../docs';

const variants = [
  'solid',
  'soft',
  'surface',
  'outline',
  'ghost',
] as const satisfies readonly ButtonVariant[];

const actions = [
  'neutral',
  'progressive',
  'destructive',
] as const satisfies readonly ButtonAction[];

const textSizes = ['sm', 'default', 'lg'] as const satisfies readonly ButtonSize[];
type TextButtonSize = (typeof textSizes)[number];

function iconSize(size: TextButtonSize): ButtonSize {
  return size === 'default' ? 'icon' : `icon-${size}`;
}

export function ButtonPlayground() {
  const [variant, setVariant] = createSignal<ButtonVariant>('solid');
  const [action, setAction] = createSignal<ButtonAction>('neutral');
  const [size, setSize] = createSignal<TextButtonSize>('default');
  const [label, setLabel] = createSignal('Save changes');
  const [disabled, setDisabled] = createSignal(false);
  const [icon, setIcon] = createSignal('none');
  const [clicks, setClicks] = createSignal(0);

  const name = () => label().trim() || 'Save changes';
  const selectedSize = () => (icon() === 'only' ? iconSize(size()) : size());
  const labelCode = () => {
    const value = JSON.stringify(name()).slice(1, -1).replaceAll('\\"', '"').replaceAll("'", "\\'");

    return `{'${value}'}`;
  };

  const code = createMemo(() => {
    const labelAttribute = /["&<>\r\n\t\u2028\u2029]/.test(name()) ? labelCode() : `"${name()}"`;
    const labelContent = /[&<>{}\r\n\t\u2028\u2029]/.test(name()) ? labelCode() : name();

    const attrs = [
      variant() !== 'solid' ? ` variant="${variant()}"` : '',
      action() !== 'neutral' ? ` action="${action()}"` : '',
      selectedSize() !== 'default' ? ` size="${selectedSize()}"` : '',
      disabled() ? ' disabled' : '',
      icon() === 'only' ? ` aria-label=${labelAttribute}` : '',
    ].join('');

    const content =
      icon() === 'only'
        ? '  <Icon icon={cdxIconEdit} />'
        : icon() === 'start'
          ? `  <Icon icon={cdxIconEdit} />\n  ${labelContent}`
          : `  ${labelContent}`;

    return `<Button${attrs}>\n${content}\n</Button>`;
  });

  return (
    <PreviewFrame class="playground @container">
      <div class="grid grid-cols-1 @min-[35rem]:grid-cols-[minmax(0,1fr)_15rem]">
        <Preview kind="playground">
          <Button
            variant={variant()}
            action={action()}
            disabled={disabled()}
            size={selectedSize()}
            aria-label={icon() === 'only' ? name() : undefined}
            onClick={() => setClicks((n) => n + 1)}
          >
            <Show when={icon() !== 'none'}>
              <Icon icon={cdxIconEdit} />
            </Show>
            <Show when={icon() !== 'only'}>{name()}</Show>
          </Button>
          <span class="text-muted text-[0.75rem]" role="status">
            {clicks() === 0
              ? 'Try the button'
              : `Clicked ${clicks()} ${clicks() === 1 ? 'time' : 'times'}`}
          </span>
        </Preview>
        <div
          class="
            flex flex-col gap-4 p-5 bg-surface border-t border-line
            @min-[35rem]:border-t-0 @min-[35rem]:border-l
          "
        >
          <Field label="Variant" for="button-variant">
            <select
              id="button-variant"
              class={fieldControlClasses}
              value={variant()}
              onChange={(e) => setVariant(e.currentTarget.value as ButtonVariant)}
            >
              <For each={variants}>{(name) => <option value={name}>{name}</option>}</For>
            </select>
          </Field>
          <Field label="Action" for="button-action">
            <select
              id="button-action"
              class={fieldControlClasses}
              value={action()}
              onChange={(e) => setAction(e.currentTarget.value as ButtonAction)}
            >
              <For each={actions}>{(name) => <option value={name}>{name}</option>}</For>
            </select>
          </Field>
          <Field label="Size" for="button-size">
            <select
              id="button-size"
              class={fieldControlClasses}
              value={size()}
              onChange={(e) => setSize(e.currentTarget.value as TextButtonSize)}
            >
              <For each={textSizes}>{(name) => <option value={name}>{name}</option>}</For>
            </select>
          </Field>
          <Field label="Label" for="button-label">
            <input
              id="button-label"
              class={fieldControlClasses}
              value={label()}
              onInput={(e) => setLabel(e.currentTarget.value)}
            />
          </Field>
          <Field label="Icon" for="button-icon">
            <select
              id="button-icon"
              class={fieldControlClasses}
              value={icon()}
              onChange={(e) => setIcon(e.currentTarget.value)}
            >
              <option value="none">None</option>
              <option value="start">Before label</option>
              <option value="only">Icon only</option>
            </select>
          </Field>
          <label class="flex items-center gap-2 text-[0.8125rem] font-normal">
            <input
              class="size-4 m-0 accent-action"
              type="checkbox"
              checked={disabled()}
              onChange={(e) => setDisabled(e.currentTarget.checked)}
            />
            Disabled
          </label>
        </div>
      </div>
      <CodeBlock code={code()} />
    </PreviewFrame>
  );
}

function FormExample() {
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
      <span class="text-[0.8125rem] leading-5 text-muted" role="status">
        {message()}
      </span>
    </form>
  );
}

export function ButtonBasic() {
  const [basicCount, setBasicCount] = createSignal(0);

  return (
    <Preview kind="basic">
      <Button onClick={() => setBasicCount((n) => n + 1)}>Save changes</Button>
      <span class="text-[0.8125rem] leading-5 text-muted" role="status">
        {basicCount() ? 'Changes saved' : 'Built with Kobalte'}
      </span>
    </Preview>
  );
}

export function ButtonExamples() {
  return (
    <>
      <Example
        title="Variants"
        code={variants
          .map(
            (name) =>
              `<Button${name !== 'solid' ? ` variant="${name}"` : ''}>${name[0].toUpperCase() + name.slice(1)}</Button>`,
          )
          .join('\n')}
      >
        <For each={variants}>
          {(name) => <Button variant={name}>{name[0].toUpperCase() + name.slice(1)}</Button>}
        </For>
      </Example>
      <Example
        title="Actions"
        description="Keep the same visual style while changing the meaning of the action."
        code={`<Button variant="surface">
  Preview
</Button>

<Button variant="surface" action="progressive">
  Continue
</Button>

<Button variant="surface" action="destructive">
  Delete draft
</Button>`}
      >
        <Button variant="surface">Preview</Button>
        <Button variant="surface" action="progressive">
          Continue
        </Button>
        <Button variant="surface" action="destructive">
          Delete draft
        </Button>
      </Example>
      <Example
        title="Sizes"
        code={`<Button variant="outline" size="sm">Small</Button>
<Button variant="outline" size="icon-sm" aria-label="Edit">
  <Icon icon={cdxIconEdit} />
</Button>

<Button variant="outline">Default</Button>
<Button variant="outline" size="icon" aria-label="Edit">
  <Icon icon={cdxIconEdit} />
</Button>

<Button variant="outline" size="lg">Large</Button>
<Button variant="outline" size="icon-lg" aria-label="Edit">
  <Icon icon={cdxIconEdit} />
</Button>`}
      >
        <For each={textSizes}>
          {(size) => (
            <div class="flex items-center gap-2">
              <Button variant="outline" size={size}>
                {size === 'sm' ? 'Small' : size === 'lg' ? 'Large' : 'Default'}
              </Button>
              <Button variant="outline" size={iconSize(size)} aria-label="Edit">
                <Icon icon={cdxIconEdit} />
              </Button>
            </div>
          )}
        </For>
      </Example>
      <Example
        title="With icons"
        code={`<Button action="progressive">
  <Icon icon={cdxIconAdd} />
  New article
</Button>

<Button variant="outline" action="progressive">
  Continue
  <Icon icon={cdxIconArrowNext} />
</Button>

<Button variant="outline" size="icon" aria-label="Download">
  <Icon icon={cdxIconDownload} />
</Button>`}
      >
        <Button action="progressive">
          <Icon icon={cdxIconAdd} />
          New article
        </Button>
        <Button variant="outline" action="progressive">
          Continue
          <Icon icon={cdxIconArrowNext} />
        </Button>
        <Button variant="outline" size="icon" aria-label="Download">
          <Icon icon={cdxIconDownload} />
        </Button>
      </Example>
      <Example
        title="Destructive action"
        description="Use a clear label alongside the destructive color."
        code={`<Button action="destructive">
  <Icon icon={cdxIconTrash} />
  Delete draft
</Button>

<Button variant="outline" action="destructive">
  Delete draft
</Button>

<Button variant="ghost" action="destructive">
  Delete draft
</Button>`}
      >
        <Button action="destructive">
          <Icon icon={cdxIconTrash} />
          Delete draft
        </Button>
        <Button variant="outline" action="destructive">
          Delete draft
        </Button>
        <Button variant="ghost" action="destructive">
          Delete draft
        </Button>
      </Example>
      <Example
        title="Disabled and busy"
        description="Keep a visible label for the current state."
        code={
          '<Button disabled>Save changes</Button>\n<Button variant="outline" disabled>Unavailable</Button>\n<Button disabled aria-busy="true">Saving…</Button>'
        }
      >
        <Button disabled>Save changes</Button>
        <Button variant="outline" disabled>
          Unavailable
        </Button>
        <Button disabled aria-busy="true">
          Saving…
        </Button>
      </Example>
      <Example
        title="Form actions"
        description={'Use type="submit" explicitly. Other buttons keep type="button".'}
        code={
          '<form onSubmit={handleSubmit}>\n  <Button action="progressive" type="submit">Submit</Button>\n  <Button variant="outline" onClick={openPreview}>Preview</Button>\n</form>'
        }
      >
        <FormExample />
      </Example>
      <Example
        title="As a link"
        description="Use a native anchor for navigation that needs button styling."
        code={`<a
  href="/foundations/colors"
  class={buttonVariants({ variant: 'outline' })}
>
  Explore colors
  <Icon icon={cdxIconArrowNext} />
</a>`}
      >
        <a href="/foundations/colors" class={buttonVariants({ variant: 'outline' })}>
          Explore colors
          <Icon icon={cdxIconArrowNext} />
        </a>
      </Example>
    </>
  );
}
