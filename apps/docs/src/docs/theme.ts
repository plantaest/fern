import { createEffect, createSignal } from 'solid-js';

export type Theme = 'light' | 'dark';

function savedTheme(): Theme {
  try {
    return localStorage.getItem('fern-docs-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function createDocsTheme() {
  const [theme, setTheme] = createSignal<Theme>(savedTheme());

  createEffect(
    () => theme(),
    (value) => {
      try {
        localStorage.setItem('fern-docs-theme', value);
      } catch {
        /* The theme still works without storage. */
      }
    },
  );

  return [theme, setTheme] as const;
}
