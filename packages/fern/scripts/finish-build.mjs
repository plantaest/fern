import { copyFile } from 'node:fs/promises';

for (const file of ['tokens.css', 'colors.json', 'tailwind.css']) {
  await copyFile(`src/foundations/${file}`, `dist/${file}`);
}
