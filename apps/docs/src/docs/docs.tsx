import type { JSX } from '@solidjs/web';
import { Icon } from '@taxon-labs/fern/icon';
import { cdxIconCheck, cdxIconCopy } from '@wikimedia/codex-icons';
import { createSignal } from 'solid-js';

export const sectionId = (title: string) => title.toLowerCase().replaceAll(' ', '-');

export const fieldControlClasses = `
  min-w-0 w-full h-9 px-2.5 py-0 border border-docs-control
  rounded-fern text-content bg-canvas font-normal text-[13px]
  leading-none placeholder:text-docs-placeholder
`;

const previewClasses = {
  basic: `
    flex-wrap gap-4 py-7 px-6 border border-line rounded-fern
    docs-mobile:py-6 docs-mobile:px-4
  `,
  example: `
    min-h-28 flex-wrap justify-center gap-3 py-8 px-6
    docs-mobile:py-6 docs-mobile:px-4
  `,
  playground: 'min-h-40 flex-col justify-center gap-5 py-8 px-6',
};

export function Preview(props: { kind: keyof typeof previewClasses; children: JSX.Element }) {
  return <div class={`flex items-center ${previewClasses[props.kind]}`}>{props.children}</div>;
}

export function PreviewFrame(props: { children: JSX.Element; class?: string }) {
  return (
    <div class={`border border-line rounded-fern overflow-hidden ${props.class ?? ''}`}>
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
      class={`flex flex-col gap-2 text-[12px] font-medium min-w-0 ${props.class ?? ''}`}
    >
      {props.label}
      {props.children}
    </label>
  );
}

export function ReadingSample(props: { children: JSX.Element; lang?: string }) {
  return (
    <div lang={props.lang} class="max-w-[560px] [&_p]:mt-4">
      {props.children}
    </div>
  );
}

export function PageIntro(props: { title: string; description: string; category?: string }) {
  return (
    <header class="mb-8">
      <p class="text-muted text-[12px] leading-5 mb-3">{props.category ?? 'Foundations'}</p>
      <h1>{props.title}</h1>
      <p class="text-muted mt-3 text-[15px]">{props.description}</p>
    </header>
  );
}

export function Section(props: { title: string; children: JSX.Element; description?: string }) {
  return (
    <section
      class="doc-section mt-12 scroll-mt-[100px] docs-mobile:scroll-mt-[88px]"
      id={sectionId(props.title)}
    >
      <h2 class="mb-5">{props.title}</h2>
      {props.description && <p class="text-[14px] text-muted -mt-2 mb-5">{props.description}</p>}
      {props.children}
    </section>
  );
}

export function CodeBlock(props: { code: string; embedded?: boolean }) {
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
    <div class={`bg-surface ${props.embedded ? '' : 'border-t border-line'}`}>
      <div
        class="
          flex items-center justify-between h-11 px-4 text-[11px]
          text-muted
        "
      >
        <span>TSX</span>
        <button
          class="
            flex items-center gap-1.5 py-1 px-1.5 min-h-7
            text-[11px] border-0 rounded-fern text-muted bg-transparent
            cursor-pointer hover:text-content hover:bg-docs-hover
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
        <code>{props.code}</code>
      </pre>
      <span class="sr-only" role="status">
        {status()}
      </span>
    </div>
  );
}

export function Example(props: {
  title: string;
  code: string;
  children: JSX.Element;
  description?: string;
}) {
  return (
    <article class="[&+&]:mt-8">
      <h3
        class="
          font-sans font-medium text-[15px] leading-6 tracking-normal
          mb-3
        "
      >
        {props.title}
      </h3>
      {props.description && <p class="text-[13px] text-muted mb-5">{props.description}</p>}
      <PreviewFrame>
        <Preview kind="example">{props.children}</Preview>
        <details>
          <summary
            class="
              border-t border-line py-3 px-4 text-[12px] text-muted
              bg-surface
            "
          >
            View code
          </summary>
          <CodeBlock code={props.code} embedded />
        </details>
      </PreviewFrame>
    </article>
  );
}
