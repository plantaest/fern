import { For } from 'solid-js';

const families = [
  { name: 'Sans', font: 'Inter', class: 'font-sans' },
  { name: 'Serif', font: 'Source Serif 4', class: 'font-serif' },
  { name: 'Mono', font: 'JetBrains Mono', class: 'font-mono' },
];

export function TypographyFontFamilies() {
  return (
    <div class="fern-not-prose grid grid-cols-3 gap-4 screen-small:grid-cols-1">
      <For each={families}>
        {(family) => (
          <div class="border border-line-subtle rounded-base p-4">
            <p class="text-small font-medium mb-1">{family.name}</p>
            <p class="text-extra-small text-content-subtle mb-4">{family.font}</p>
            <p class={`text-lg leading-md mb-4 ${family.class}`} lang="vi">
              Tri thức mở cho mọi người
            </p>
            <code class="font-mono text-extra-small text-content-subtle">{family.class}</code>
          </div>
        )}
      </For>
    </div>
  );
}

const weights = [
  { name: 'Normal', value: 400, class: 'font-normal' },
  { name: 'Medium', value: 500, class: 'font-medium' },
  { name: 'Semibold', value: 600, class: 'font-semibold' },
  { name: 'Bold', value: 700, class: 'font-bold' },
];

export function TypographyFontWeights() {
  return (
    <div
      class="
        fern-not-prose grid grid-cols-4 gap-4 border-y border-line-subtle py-4
        screen-small:grid-cols-2
      "
    >
      <For each={weights}>
        {(weight) => (
          <div>
            <p class={`text-base leading-md mb-2 ${weight.class}`}>{weight.name}</p>
            <code class="font-mono text-extra-small text-content-subtle">
              {weight.class} · {weight.value}
            </code>
          </div>
        )}
      </For>
    </div>
  );
}

const textStyles = [
  {
    name: 'H1',
    metrics: '36 / 44',
    family: 'Serif · 600',
    class: 'font-serif font-semibold text-heading-1',
    sample: 'A place for knowledge',
  },
  {
    name: 'H2',
    metrics: '28 / 36',
    family: 'Serif · 600',
    class: 'font-serif font-semibold text-heading-2',
    sample: 'Built for useful work',
  },
  {
    name: 'H3',
    metrics: '22 / 28',
    family: 'Sans · 600',
    class: 'font-sans font-semibold text-heading-3',
    sample: 'Every detail has a purpose',
  },
  {
    name: 'H4',
    metrics: '18 / 24',
    family: 'Sans · 600',
    class: 'font-sans font-semibold text-heading-4',
    sample: 'Make the next step clear',
  },
  {
    name: 'H5',
    metrics: '16 / 24',
    family: 'Sans · 600',
    class: 'font-sans font-semibold text-heading-5',
    sample: 'Keep useful details close',
  },
  {
    name: 'H6',
    metrics: '14 / 20',
    family: 'Sans · 600',
    class: 'font-sans font-semibold text-heading-6',
    sample: 'Every contribution matters',
  },
  {
    name: 'Body',
    metrics: '16 / 26',
    family: 'Sans · 400',
    class: 'font-sans font-normal text-body',
    sample: 'Find information, make an edit, and keep moving.',
  },
  {
    name: 'Small',
    metrics: '14 / 20',
    family: 'Sans · 400',
    class: 'font-sans font-normal text-small',
    sample: 'Useful details, kept close to the task.',
  },
  {
    name: 'Extra small',
    metrics: '12 / 20',
    family: 'Sans · 400',
    class: 'font-sans font-normal text-extra-small',
    sample: 'Additional information at a glance.',
  },
];

export function TypographyTextStyles() {
  return (
    <div class="fern-not-prose border-t border-line-subtle">
      <For each={textStyles}>
        {(style) => (
          <div
            class="
              grid grid-cols-[minmax(0,1fr)_max-content] items-center gap-4 py-4
              border-b border-line-subtle screen-small:grid-cols-1 screen-small:gap-2
            "
          >
            <p class={style.class}>{style.sample}</p>
            <div class="text-extra-small text-content-subtle text-right screen-small:text-left">
              <code class="font-mono text-xs">
                {style.name} · {style.metrics}
              </code>
              <p>{style.family}</p>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

export function TypographyInterfaceText() {
  return (
    <div class="fern-not-prose border border-line-subtle rounded-base p-5 space-y-3">
      <p class="text-sm leading-sm font-medium">Save changes</p>
      <p class="text-xs leading-sm text-content-subtle">Last edited a few minutes ago.</p>
      <code class="block font-mono text-sm leading-sm">const enabled = true;</code>
    </div>
  );
}
