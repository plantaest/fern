import {
  Button,
  type ButtonVariant,
  buttonVariantNames,
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

export function ButtonPlayground() {
  const [variant, setVariant] = createSignal<ButtonVariant>('default');
  const [label, setLabel] = createSignal('Save changes');
  const [disabled, setDisabled] = createSignal(false);
  const [icon, setIcon] = createSignal('none');
  const [clicks, setClicks] = createSignal(0);

  const name = () => label().trim() || 'Save changes';
  const labelCode = () => {
    const value = JSON.stringify(name()).slice(1, -1).replaceAll('\\"', '"').replaceAll("'", "\\'");

    return `{'${value}'}`;
  };

  const code = createMemo(() => {
    const labelAttribute = /["&<>\r\n\t\u2028\u2029]/.test(name()) ? labelCode() : `"${name()}"`;
    const labelContent = /[&<>{}\r\n\t\u2028\u2029]/.test(name()) ? labelCode() : name();

    const attrs = [
      variant() !== 'default' ? ` variant="${variant()}"` : '',
      disabled() ? ' disabled' : '',
      icon() === 'only' ? ` size="icon" aria-label=${labelAttribute}` : '',
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
    <PreviewFrame class="playground">
      <Preview kind="playground">
        <Button
          variant={variant()}
          disabled={disabled()}
          size={icon() === 'only' ? 'icon' : 'default'}
          aria-label={icon() === 'only' ? name() : undefined}
          onClick={() => setClicks((n) => n + 1)}
        >
          <Show when={icon() !== 'none'}>
            <Icon icon={cdxIconEdit} />
          </Show>
          <Show when={icon() !== 'only'}>{name()}</Show>
        </Button>
        <span class="text-muted text-[12px]" role="status">
          {clicks() === 0
            ? 'Try the button'
            : `Clicked ${clicks()} ${clicks() === 1 ? 'time' : 'times'}`}
        </span>
      </Preview>
      <div
        class="
          grid grid-cols-[1fr_1.4fr_1fr] gap-4 py-5 px-6 bg-surface
          border-t border-line docs-mobile:grid-cols-2 docs-mobile:gap-x-3
          docs-mobile:px-4
        "
      >
        <Field label="Variant" for="button-variant">
          <select
            id="button-variant"
            class={fieldControlClasses}
            value={variant()}
            onChange={(e) => setVariant(e.currentTarget.value as ButtonVariant)}
          >
            <For each={buttonVariantNames}>{(name) => <option value={name}>{name}</option>}</For>
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
        <label
          class="
            flex items-center gap-2 text-[13px] font-normal
            col-span-full docs-mobile:col-auto docs-mobile:self-end
            docs-mobile:min-h-9
          "
        >
          <input
            class="size-4 m-0 accent-action"
            type="checkbox"
            checked={disabled()}
            onChange={(e) => setDisabled(e.currentTarget.checked)}
          />
          Disabled
        </label>
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
        <Button type="submit">Submit</Button>
        <Button variant="outline" onClick={() => setMessage('Preview opened — form not submitted')}>
          Preview
        </Button>
      </div>
      <span class="text-[13px] leading-5 text-muted" role="status">
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
      <span class="text-[13px] leading-5 text-muted" role="status">
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
        code={buttonVariantNames
          .map(
            (name) =>
              `<Button${name !== 'default' ? ` variant="${name}"` : ''}>${name[0].toUpperCase() + name.slice(1)}</Button>`,
          )
          .join('\n')}
      >
        <For each={buttonVariantNames}>
          {(name) => <Button variant={name}>{name[0].toUpperCase() + name.slice(1)}</Button>}
        </For>
      </Example>
      <Example
        title="With icons"
        code={`<Button>
  <Icon icon={cdxIconAdd} />
  New article
</Button>

<Button variant="outline">
  Continue
  <Icon icon={cdxIconArrowNext} />
</Button>

<Button variant="outline" size="icon" aria-label="Download">
  <Icon icon={cdxIconDownload} />
</Button>`}
      >
        <Button>
          <Icon icon={cdxIconAdd} />
          New article
        </Button>
        <Button variant="outline">
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
        code={`<Button variant="destructive">
  <Icon icon={cdxIconTrash} />
  Delete draft
</Button>`}
      >
        <Button variant="destructive">
          <Icon icon={cdxIconTrash} />
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
          '<form onSubmit={handleSubmit}>\n  <Button type="submit">Submit</Button>\n  <Button variant="outline" onClick={openPreview}>Preview</Button>\n</form>'
        }
      >
        <FormExample />
      </Example>
      <Example
        title="As a link"
        description="Keep a real anchor for navigation, including opening in a new tab."
        code={`<a href="/foundations/colors" class={buttonVariants({ variant: 'outline' })}>
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
