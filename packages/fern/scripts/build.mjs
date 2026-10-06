import { spawn } from 'node:child_process';
import { copyFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateColors } from './colors.mjs';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));

function run(script, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], { cwd: root, stdio: 'inherit' });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${script} failed (${signal ?? code})`));
    });
  });
}

await rm(join(root, 'dist'), { recursive: true, force: true });
await generateColors();

await run(require.resolve('typescript/bin/tsc'), ['-p', 'tsconfig.build.json']);
await run(join(dirname(require.resolve('vite/package.json')), 'bin/vite.js'), ['build']);

for (const file of ['colors.css', 'colors.json']) {
  await copyFile(join(root, 'src/foundations', file), join(root, 'dist', file));
}

await copyFile(join(root, 'src/tailwind.css'), join(root, 'dist/tailwind.css'));
