import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// Smoke-test the tarball in a clean Solid app without overrides or Tailwind.

const pnpm = process.env.npm_execpath;
assert.ok(pnpm, 'Run with pnpm pack:check or pnpm release:check');

const temp = await mkdtemp(join(tmpdir(), 'fern-package-check-'));
const run = (args, cwd = temp) =>
  execFileSync(process.execPath, [pnpm, ...args], { cwd, stdio: 'inherit' });

try {
  run(['pack', '--pack-destination', temp], resolve(import.meta.dirname, '../packages/fern'));
  const tarball = (await readdir(temp)).find((name) => name.endsWith('.tgz'));
  assert.ok(tarball, 'Expected a packed Fern tarball');

  const solid = '2.0.0-rc.21';
  const files = {
    'package.json': JSON.stringify({
      name: 'fern-clean-consumer',
      private: true,
      type: 'module',
      dependencies: {
        '@taxonlabs/fern': `file:./${tarball}`,
        '@solidjs/web': solid,
        'solid-js': solid,
        '@wikimedia/codex-icons': '2.7.0',
      },
      devDependencies: {
        '@solidjs/vite-plugin': '3.0.0-next.57',
        jsdom: '31.0.0',
        typescript: '7.0.2',
        vite: '8.3.6',
        vitest: '5.1.0',
      },
    }),
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'preserve',
        jsxImportSource: '@solidjs/web',
        types: ['vite/client'],
        strict: true,
        skipLibCheck: true,
        noEmit: true,
      },
      include: ['*.tsx'],
    }),
    'vite.config.ts': `
import solid from '@solidjs/vite-plugin';
export default { plugins: [solid()], test: { environment: 'jsdom' } };
`,
    'index.html': `
<!doctype html>
<div id="root"></div>
<script type="module" src="/main.tsx"></script>
`,
    'main.tsx': `
import { render } from '@solidjs/web';
import { Button, type ButtonProps } from '@taxonlabs/fern';
import '@taxonlabs/fern/styles.css';

const props: ButtonProps = { action: 'progressive' };
render(() => <div class="fern"><Button {...props}>Save</Button></div>, document.getElementById('root')!);
`,
    'consumer.test.tsx': `
import { render } from '@solidjs/web';
import { Button } from '@taxonlabs/fern/button';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconEdit } from '@wikimedia/codex-icons';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';

it('renders packed exports and updates a reactive prop', () => {
  const host = document.body.appendChild(document.createElement('div'));
  const [disabled, setDisabled] = createSignal(false);
  const dispose = render(() => (
    <Button disabled={disabled()} aria-label="Edit"><Icon icon={cdxIconEdit} /></Button>
  ), host);

  try {
    flush();
    const button = host.querySelector('button')!;
    expect(button.querySelector('svg')).not.toBeNull();
    expect(button.disabled).toBe(false);
    setDisabled(true);
    flush();
    expect(button.disabled).toBe(true);
  } finally {
    dispose();
    host.remove();
  }
});
`,
  };

  await Promise.all(
    Object.entries(files).map(([name, content]) => writeFile(join(temp, name), content)),
  );

  run([
    'install',
    '--ignore-scripts',
    ...(process.argv.includes('--strict-peers') ? ['--strict-peer-dependencies'] : []),
  ]);

  const runtimes = (await readdir(join(temp, 'node_modules/.pnpm'))).filter((name) =>
    /^(solid-js|@solidjs\+(?:web|signals))@/.test(name),
  );
  assert.ok(
    runtimes.length === 3 && runtimes.every((name) => name.includes(`@${solid}`)),
    `Unexpected Solid runtime: ${runtimes.join(', ')}`,
  );

  run(['exec', 'tsc']);
  run(['exec', 'vitest', 'run']);
  run(['exec', 'vite', 'build']);

  const assets = join(temp, 'dist/assets');
  const stylesheet = (await readdir(assets)).find((name) => name.endsWith('.css'));
  assert.ok(stylesheet, 'Expected a built stylesheet');

  const css = await readFile(join(assets, stylesheet), 'utf8');
  assert.match(css, /\.fern-button\b/);
  assert.doesNotMatch(css, /@(?:apply|theme|reference)\b|--spacing\(/);

  console.log('Package check passed: packed imports, types, reactivity, and standalone CSS.');
} finally {
  await rm(temp, { recursive: true, force: true });
}
