// Verify the packed Fern package in a clean application without workspace overrides or Tailwind.

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pnpm = process.env.npm_execpath;
assert.ok(pnpm, 'Run this script with pnpm pack:check or pnpm release:check');

const temp = await mkdtemp(join(tmpdir(), 'fern-package-check-'));

const run = (args, cwd = temp) =>
  new Promise((accept, reject) => {
    const child = spawn(process.execPath, [pnpm, ...args], { cwd, stdio: 'inherit' });

    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? accept() : reject(new Error(`pnpm ${args.join(' ')} exited ${code}`)),
    );
  });

await run(['pack', '--pack-destination', temp], join(root, 'packages/fern'));

const tarball = (await readdir(temp)).find((file) => file.endsWith('.tgz'));
assert.ok(tarball, 'pnpm pack must produce a tarball');

const manifest = {
  name: 'fern-clean-consumer',
  private: true,
  type: 'module',
  dependencies: {
    '@taxon-labs/fern': `file:${join(temp, tarball)}`,
    'solid-js': '2.0.0-rc.13',
    '@solidjs/web': '2.0.0-rc.13',
    '@wikimedia/codex-icons': '2.7.0',
  },
  devDependencies: {
    '@solidjs/vite-plugin': '3.0.0-next.46',
    vite: '8.3.2',
    typescript: '5.9.3',
    vitest: '4.1.11',
    jsdom: '26.1.0',
  },
};

await writeFile(join(temp, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);

await writeFile(
  join(temp, 'vite.config.ts'),
  `
import solid from '@solidjs/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    include: ['*.test.tsx'],
  },
});
`,
);

await writeFile(
  join(temp, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      jsx: 'preserve',
      jsxImportSource: '@solidjs/web',
      strict: true,
      skipLibCheck: true,
      noEmit: true,
    },
    include: ['main.tsx'],
  }),
);

await writeFile(
  join(temp, 'index.html'),
  `<!doctype html>
<html>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>`,
);

await writeFile(
  join(temp, 'main.tsx'),
  `
import { type JSX, render } from '@solidjs/web';
import { Button, Icon, buttonVariants, type ButtonProps } from '@taxon-labs/fern';
import { cdxIconEdit } from '@wikimedia/codex-icons';
import { omit } from 'solid-js';
import '@taxon-labs/fern/styles.css';

type LinkProps = Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };

function Link(props: LinkProps) {
  return <a {...omit(props, 'to')} href={props.to} />;
}

const props: ButtonProps = {
  variant: 'surface',
  action: 'destructive',
  size: 'sm',
  type: 'button',
  'aria-label': 'Edit',
};

const linkProps: ButtonProps<typeof Link> = {
  to: '/article',
  variant: 'outline',
};

render(
  () => (
    <div class="fern" data-theme="dark">
      <Button {...props}>
        <Icon icon={cdxIconEdit} />
        Edit
      </Button>
      <a href="/article" class={buttonVariants({ variant: 'outline', size: 'lg' })}>
        Read
      </a>
      <Button as={Link} {...linkProps}>
        Read with Link
      </Button>
      <Button as="a" href="/article">
        Read article
      </Button>
    </div>
  ),
  document.getElementById('root')!,
);
`,
);

const tests = (
  await readFile(join(root, 'packages/fern/src/components/button/button.test.tsx'), 'utf8')
)
  .replace("from './button'", "from '@taxon-labs/fern/button'")
  .replace("from '../icon/icon'", "from '@taxon-labs/fern/icon'");

await writeFile(join(temp, 'button.test.tsx'), tests);

await writeFile(
  join(temp, 'vite.default.config.ts'),
  `
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { conditions: ['browser'] },
  ssr: {
    resolve: { conditions: ['browser'] },
  },
  test: {
    environment: 'jsdom',
    server: { deps: { inline: true } },
    include: ['default.test.mjs'],
  },
});
`,
);

await writeFile(
  join(temp, 'default.test.mjs'),
  `
import { expect, it } from 'vitest';
import { flush, createSignal } from 'solid-js';
import { render } from '@solidjs/web';
import { Button } from '@taxon-labs/fern';

it('uses the compiled ESM export without a Solid compiler plugin', () => {
  const host = document.createElement('div');
  document.body.append(host);

  let clicks = 0;
  const [disabled, setDisabled] = createSignal(false);

  const dispose = render(
    () => [
      Button({
        children: 'Save',
        get disabled() {
          return disabled();
        },
        onClick: () => clicks++,
      }),
      Button({ as: 'a', href: '/article', children: 'Read' }),
    ],
    host,
  );
  flush();

  const button = host.querySelector('button');
  expect(button.type).toBe('button');

  button.click();
  expect(clicks).toBe(1);

  setDisabled(true);
  flush();
  button.click();
  expect(button.disabled).toBe(true);
  expect(clicks).toBe(1);

  const link = host.querySelector('a');
  expect(link.getAttribute('href')).toBe('/article');
  expect(link.hasAttribute('role')).toBe(false);
  expect(link.hasAttribute('type')).toBe(false);

  dispose();
  host.remove();
});
`,
);

console.log(`Clean consumer: ${temp} (no overrides, no source aliases, no Tailwind)`);

await run([
  'install',
  '--ignore-scripts',
  ...(process.argv.includes('--strict-peers') ? ['--strict-peer-dependencies'] : []),
]);

const runtimeDirs = (await readdir(join(temp, 'node_modules/.pnpm'))).filter((name) =>
  /^(solid-js|@solidjs\+(?:web|signals))@/.test(name),
);
assert.ok(runtimeDirs.length >= 3);
assert.ok(
  runtimeDirs.every((name) => name.includes('@2.0.0-rc.13')),
  `Unexpected Solid runtime: ${runtimeDirs.join(', ')}`,
);

await run(['exec', 'tsc', '--noEmit']);
await run(['exec', 'vitest', 'run']);
await run(['exec', 'vitest', 'run', '--config', 'vite.default.config.ts']);
await run(['exec', 'vite', 'build']);

const assets = await readdir(join(temp, 'dist/assets'));
const cssFile = assets.find((file) => file.endsWith('.css'));
assert.ok(cssFile, 'The consumer build must include Fern CSS');

const css = await readFile(join(temp, 'dist/assets', cssFile), 'utf8');
assert.ok(css.includes('.fern-button') && css.includes('[data-theme=dark]'));
assert.ok(!/@(?:apply|theme|reference)\b|--spacing\(/.test(css), 'CSS must already be compiled');

console.log(
  'Package check passed: types, exported imports, behavior, one Solid runtime, and standalone CSS.',
);
