import { createSignal, onSettled } from 'solid-js';

export type Theme = 'light' | 'dark';

const themeStorageKey = 'fern-docs-theme';

// Apply the saved palette before the rest of the document is painted.
export const themeBootScript = `
try {
  if (localStorage.getItem(${JSON.stringify(themeStorageKey)}) === 'dark') {
    document.currentScript.parentElement.dataset.theme = 'dark';
  }
} catch {}
`;

function savedTheme(): Theme {
  try {
    return localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function createDocsTheme() {
  const [theme, updateTheme] = createSignal<Theme>('light');

  onSettled(() => {
    updateTheme(savedTheme());
  });

  function setTheme(value: Theme) {
    updateTheme(value);

    try {
      localStorage.setItem(themeStorageKey, value);
    } catch {
      /* The theme still works without storage. */
    }
  }

  return [theme, setTheme] as const;
}
