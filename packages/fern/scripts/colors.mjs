import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const fernColors = (colors) =>
  Object.fromEntries(
    Object.entries(colors).map(([name, value]) => [name.replace(/([a-z])(\d+)/g, '$1-$2'), value]),
  );

const declarations = (colors) =>
  ['color', 'background-color', 'border-color', 'box-shadow-color', 'accent-color']
    .map((group) =>
      Object.entries(colors)
        .filter(([name]) => name.startsWith(`${group}-`))
        .map(([name, value]) => `  --fern-${name}: ${value};`)
        .join('\n'),
    )
    .filter(Boolean)
    .join('\n\n');

export async function generateColors() {
  const light = fernColors(await readColors('light'));
  const dark = fernColors(await readColors('dark'));

  await writeFile(
    new URL('../src/foundations/colors.css', import.meta.url),
    `/* Generated from Codex 2.7.0 (GPL-2.0-or-later). Run pnpm colors. */

.fern {
  color-scheme: light;

${declarations(light)}
}

.fern[data-theme="dark"] {
  color-scheme: dark;

${declarations(dark)}
}
`,
  );

  await writeFile(
    new URL('../src/foundations/colors.json', import.meta.url),
    `${JSON.stringify({ light, dark }, null, 2)}\n`,
  );

  console.log(`Codex: ${Object.keys(light).length} color values preserved per theme.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateColors();
}
