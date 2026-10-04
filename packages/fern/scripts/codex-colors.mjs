import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const root = dirname(require.resolve('@wikimedia/codex-design-tokens/package.json'));

// Normalize function spacing without changing any channel or alpha value.
export const normalizeColor = (value) => value.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');

export async function readColors(mode, normalize = true) {
  const name = mode === 'dark' ? 'theme-wikimedia-ui-mode-dark.json' : 'theme-wikimedia-ui.json';
  const data = JSON.parse(await readFile(join(root, name), 'utf8'));

  return Object.fromEntries(
    ['color', 'background-color', 'border-color', 'box-shadow-color', 'accent-color']
      .flatMap((group) => Object.values(data[group] || {}))
      .filter((token) => token.name && typeof token.value === 'string')
      .map((token) => [token.name, normalize ? normalizeColor(token.value) : token.value]),
  );
}
