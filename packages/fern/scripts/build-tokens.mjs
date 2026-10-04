import { writeFile } from 'node:fs/promises';
import { readColors } from './codex-colors.mjs';

const light = await readColors('light');
const dark = await readColors('dark');

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

await writeFile(
  'src/foundations/tokens.css',
  `/* Generated from Codex 2.7.0 (GPL-2.0-or-later). Run pnpm tokens. */

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

await writeFile('src/foundations/colors.json', `${JSON.stringify({ light, dark }, null, 2)}\n`);

console.log(`Codex: ${Object.keys(light).length} exact color tokens per theme.`);
