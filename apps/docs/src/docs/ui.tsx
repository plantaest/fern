import { dynamic, type JSX } from '@solidjs/web';
import { Icon } from '@taxon-labs/fern/icon';
import { cdxIconCheck, cdxIconCopy } from '@wikimedia/codex-icons';
import { type Component, createSignal } from 'solid-js';

export const fieldControlClasses = `
  min-w-0 w-full h-8 px-2.5 py-0 border border-docs-control
  rounded-base text-content bg-canvas font-normal text-small
  leading-none placeholder:text-docs-placeholder
`;

const previewClasses = {
  basic: `
    flex-wrap gap-4 py-7 px-6 border border-line rounded-base
    docs-mobile:py-6 docs-mobile:px-4
  `,
  example: `
    min-h-28 flex-wrap justify-center gap-3 py-8 px-6
    docs-mobile:py-6 docs-mobile:px-4
  `,
  playground: 'min-w-0 min-h-40 flex-col justify-center gap-5 py-8 px-6',
};

export function Preview(props: { kind: keyof typeof previewClasses; children: JSX.Element }) {
  return <div class={`flex items-center ${previewClasses[props.kind]}`}>{props.children}</div>;
}

export function PreviewFrame(props: { children: JSX.Element; class?: string }) {
  return (
    <div class={`border border-line rounded-base overflow-hidden ${props.class ?? ''}`}>
      {props.children}
    </div>
  );
}

export function Field(props: {
  label: string;
  for: string;
  children: JSX.Element;
  class?: string;
}) {
  return (
    <label
      for={props.for}
      class={`flex flex-col gap-2 text-[0.75rem] font-medium min-w-0 ${props.class ?? ''}`}
    >
      {props.label}
      {props.children}
    </label>
  );
}

export function PageIntro(props: { title: string; description: string; category: string }) {
  return (
    <header class="mb-8">
      <p class="text-muted text-[0.75rem] leading-5 mb-3">{props.category}</p>
      <h1>{props.title}</h1>
      <p class="text-muted mt-3 text-body">{props.description}</p>
    </header>
  );
}

export function CodeBlock(props: { code: string; language?: string; embedded?: boolean }) {
  const [copyResult, setCopyResult] = createSignal<{ code: string; message: string }>();

  const status = () => {
    const result = copyResult();

    return result?.code === props.code ? result.message : '';
  };

  async function copy() {
    const code = props.code;

    try {
      await navigator.clipboard.writeText(code);
      setCopyResult({ code, message: 'Copied' });
    } catch {
      setCopyResult({ code, message: 'Copy unavailable. Select the code to copy it.' });
    }
  }

  return (
    <div class={`doc-code-block bg-surface ${props.embedded ? '' : 'border-t border-line'}`}>
      <div
        class="
          flex items-center justify-between h-11 px-4 text-[0.6875rem]
          text-muted
        "
      >
        <span>{(props.language ?? 'tsx').toUpperCase()}</span>
        <button
          class="
            flex items-center gap-1.5 py-1 px-1.5 min-h-7
            text-[0.6875rem] border-0 rounded-base text-muted bg-transparent
            hover:text-content hover:bg-docs-hover
          "
          type="button"
          onClick={copy}
          aria-label="Copy code"
        >
          <Icon icon={status() === 'Copied' ? cdxIconCheck : cdxIconCopy} class="size-3.5" />
          {status() === 'Copied' ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code class={props.language ? `language-${props.language}` : undefined}>{props.code}</code>
      </pre>
      <span class="sr-only" role="status">
        {status()}
      </span>
    </div>
  );
}

export function Example(props: { demo: { component: Component; source: string } }) {
  const Demo = dynamic(() => props.demo.component);

  return (
    <PreviewFrame>
      <Preview kind="example">
        <Demo />
      </Preview>
      <details>
        <summary
          class="
            border-t border-line py-3 px-4 text-[0.75rem] text-muted
            bg-surface
          "
        >
          View code
        </summary>
        <CodeBlock code={props.demo.source} embedded />
      </details>
    </PreviewFrame>
  );
}
