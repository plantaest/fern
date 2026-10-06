import colors from '@taxon-labs/fern/colors.json';
import { createMemo, createSignal, For } from 'solid-js';
import { Field, fieldControlClasses } from '../../ui';

export type Theme = 'light' | 'dark';

const roleGroups = [
  {
    title: 'Content',
    tokens: ['color-base', 'color-subtle', 'color-placeholder', 'color-inverted-fixed'],
  },
  {
    title: 'Surfaces',
    tokens: [
      'background-color-base',
      'background-color-neutral-subtle',
      'background-color-neutral',
      'border-color-base',
    ],
  },
  {
    title: 'Actions',
    tokens: [
      'color-progressive',
      'background-color-progressive',
      'background-color-progressive-subtle',
      'border-color-progressive--focus',
    ],
  },
  { title: 'Feedback', tokens: ['color-success', 'color-warning', 'color-error', 'color-notice'] },
];

export function ColorsRoles(props: { theme: Theme }) {
  const value = (name: string) => (colors[props.theme] as Record<string, string>)[name];

  return (
    <div
      class="
        fern-not-prose grid grid-cols-2 gap-8 screen-small:gap-6 screen-tiny:grid-cols-1
      "
    >
      <For each={roleGroups}>
        {(group) => (
          <div>
            <h3 class="font-sans font-medium text-small mb-4">{group.title}</h3>
            <For each={group.tokens}>
              {(token) => (
                <div
                  class="
                    flex gap-3 items-center mt-4 min-w-0
                    screen-small:gap-2
                  "
                >
                  <span
                    class="
                      inline-block size-9 border border-line-subtle rounded-base
                      shrink-0 screen-small:size-7
                    "
                    style={{ background: value(token) }}
                  />
                  <div>
                    <code
                      class="
                        block font-mono text-extra-small wrap-anywhere
                      "
                    >
                      {token}
                    </code>
                    <span
                      class="
                        token-value block text-content-subtle font-mono text-extra-small mt-1
                      "
                    >
                      {value(token)}
                    </span>
                  </div>
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}

export function ColorsInteractionStates(props: { theme: Theme }) {
  const value = (name: string) => (colors[props.theme] as Record<string, string>)[name];

  return (
    <div
      class="
        fern-not-prose grid grid-cols-2 gap-8 screen-small:grid-cols-1 screen-small:gap-6
      "
    >
      <For each={['progressive', 'destructive']}>
        {(name) => (
          <div>
            <h3 class="font-sans font-medium text-small mb-4">
              {name === 'progressive' ? 'Progressive' : 'Destructive'}
            </h3>
            <div class="flex gap-3">
              <For each={['', '--hover', '--active']}>
                {(state) => (
                  <div class="flex-1">
                    <span
                      class="block w-full h-11 rounded-base mb-2"
                      style={{ background: value(`background-color-${name}${state}`) }}
                    />
                    <span class="block text-extra-small capitalize">
                      {state.slice(2) || 'Default'}
                    </span>
                    <code class="font-mono text-content-subtle text-extra-small">
                      {value(`background-color-${name}${state}`)}
                    </code>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

export function ColorsAllTokens(props: { theme: Theme }) {
  const [query, setQuery] = createSignal('');
  const value = (name: string) => (colors[props.theme] as Record<string, string>)[name];
  const entries = createMemo(() =>
    Object.keys(colors.light).filter((name) =>
      `${name} ${value(name)}`.toLowerCase().includes(query().toLowerCase()),
    ),
  );

  return (
    <details class="fern-not-prose fern-docs-token-disclosure border border-line-subtle rounded-base p-4">
      <summary class="text-small">
        Browse all {Object.keys(colors.light).length} color tokens
      </summary>
      <Field label="Filter tokens" for="token-filter" class="mt-5 mb-3">
        <input
          id="token-filter"
          class={fieldControlClasses}
          type="search"
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          placeholder="e.g. progressive"
        />
      </Field>
      <p class="text-extra-small text-content-subtle" role="status">
        {entries().length} {entries().length === 1 ? 'token' : 'tokens'}
      </p>
      <div class="max-w-full overflow-x-auto border-y border-line-subtle mt-3">
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Value</th>
              <th>Sample</th>
            </tr>
          </thead>
          <tbody>
            <For each={entries()}>
              {(name) => (
                <tr>
                  <td>
                    <code>{name}</code>
                  </td>
                  <td>
                    <code>{value(name)}</code>
                  </td>
                  <td>
                    <span
                      class="
                        block size-5 border border-line-subtle
                        rounded-base shrink-0
                      "
                      style={{ background: value(name) }}
                    />
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </details>
  );
}
