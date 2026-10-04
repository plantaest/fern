import { render } from '@solidjs/web';
import { flush } from 'solid-js';
import ts from 'typescript';
import { afterEach, expect, it, vi } from 'vitest';
import ButtonPage from './button.mdx';

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

it('renders MDX with Solid 2 and keeps the playground reactive', () => {
  const host = document.createElement('div');
  document.body.append(host);

  dispose = render(() => <ButtonPage />, host);
  flush();

  expect(host.querySelector('h1')?.textContent).toBe('Button');
  expect([...host.querySelectorAll('h2')].map((node) => node.textContent)).toEqual([
    'API Reference',
    'Playground',
    'Examples',
    'Accessibility',
  ]);
  expect(host.querySelector('p p')).toBeNull();
  expect(host.querySelector('summary p')).toBeNull();

  const rows = host.querySelectorAll('.api-table tbody tr');
  expect(rows).toHaveLength(6);
  expect([...rows[0].querySelectorAll('td')].map((cell) => cell.textContent)).toEqual([
    'variant',
    '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
    '"default"',
  ]);

  const playground = host.querySelector('.playground')!;
  const select = playground.querySelector('select')!;

  expect(playground.querySelector('pre code')?.textContent).toBe(
    '<Button>\n  Save changes\n</Button>',
  );

  select.value = 'destructive';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  flush();

  expect(playground.querySelector('button')?.className).toContain(
    'fern-button-variant--destructive',
  );
  expect(playground.querySelector('code')?.textContent).toContain('variant="destructive"');

  playground.querySelector('button')?.click();
  flush();

  expect(playground.querySelector('[role="status"]')?.textContent).toBe('Clicked 1 time');

  const checkbox = playground.querySelector<HTMLInputElement>('input[type="checkbox"]')!;

  checkbox.click();
  flush();

  expect(playground.querySelector('button')?.disabled).toBe(true);
});

it('keeps native labels associated and copies the playground code with an accessible status', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { clipboard: { writeText } }));

  const host = document.createElement('div');
  document.body.append(host);
  dispose = render(() => <ButtonPage />, host);
  flush();

  for (const id of ['button-variant', 'button-label', 'button-icon']) {
    const control = host.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)!;
    expect(control.labels).toHaveLength(1);
    expect(control.labels?.[0].htmlFor).toBe(id);
  }

  const playground = host.querySelector('.playground')!;
  const code = playground.querySelector('pre code')!.textContent;
  const copy = playground.querySelector<HTMLButtonElement>('button[aria-label="Copy code"]')!;
  copy.click();

  await vi.waitFor(() => {
    flush();
    expect(copy.textContent?.trim()).toBe('Copied');
  });

  expect(writeText).toHaveBeenCalledWith(code);
  const statuses = playground.querySelectorAll('[role="status"]');
  expect(statuses[statuses.length - 1].textContent).toBe('Copied');

  const label = playground.querySelector<HTMLInputElement>('#button-label')!;
  label.value = 'Publish draft';
  label.dispatchEvent(new Event('input', { bubbles: true }));
  flush();

  expect(copy.textContent?.trim()).toBe('Copy');
  expect(statuses[statuses.length - 1].textContent).toBe('');

  copy.click();

  await vi.waitFor(() => {
    flush();
    expect(copy.textContent?.trim()).toBe('Copied');
  });

  expect(writeText).toHaveBeenLastCalledWith(playground.querySelector('pre code')!.textContent);

  writeText.mockRejectedValueOnce(new Error('Clipboard unavailable'));
  copy.click();

  await vi.waitFor(() => {
    flush();
    expect(statuses[statuses.length - 1].textContent).toBe(
      'Copy unavailable. Select the code to copy it.',
    );
  });
});

it('generates valid TSX for labels with quotes and JSX characters in every icon mode', () => {
  const host = document.createElement('div');
  document.body.append(host);
  dispose = render(() => <ButtonPage />, host);
  flush();

  const label = host.querySelector<HTMLInputElement>('#button-label')!;
  const icon = host.querySelector<HTMLSelectElement>('#button-icon')!;

  for (const name of ['Save changes', "Don't save", 'Lưu thay đổi']) {
    label.value = name;
    label.dispatchEvent(new Event('input', { bubbles: true }));

    for (const mode of ['none', 'start', 'only']) {
      icon.value = mode;
      icon.dispatchEvent(new Event('change', { bubbles: true }));
      flush();

      const code = host.querySelector('.playground pre code')!.textContent!;
      expect(code).toContain(mode === 'only' ? `aria-label="${name}"` : `\n  ${name}\n`);

      const button = host.querySelector('.playground button')!;
      expect(mode === 'only' ? button.getAttribute('aria-label') : button.textContent).toBe(name);
    }
  }

  const name = `Edit 'draft' "quote" &copy; <article> {title} \\ path`;

  label.value = name;
  label.dispatchEvent(new Event('input', { bubbles: true }));

  for (const mode of ['none', 'start', 'only']) {
    icon.value = mode;
    icon.dispatchEvent(new Event('change', { bubbles: true }));
    flush();

    const code = host.querySelector('.playground pre code')!.textContent!;
    const compiled = ts.transpileModule(code, {
      fileName: 'example.tsx',
      compilerOptions: { jsx: ts.JsxEmit.Preserve },
      reportDiagnostics: true,
    });

    expect(compiled.diagnostics).toEqual([]);

    const source = ts.createSourceFile('example.tsx', code, ts.ScriptTarget.Latest, true);
    const labels: ts.StringLiteral[] = [];

    function findLabel(node: ts.Node) {
      if (ts.isStringLiteral(node) && node.text === name) {
        labels.push(node);
      }

      ts.forEachChild(node, findLabel);
    }

    findLabel(source);

    expect(labels).toHaveLength(1);
    expect(labels[0].getText(source).startsWith("'")).toBe(true);

    const button = host.querySelector('.playground button')!;
    expect(mode === 'only' ? button.getAttribute('aria-label') : button.textContent).toBe(name);
  }
});

it('does not report changed code as copied when an earlier clipboard request finishes', async () => {
  let complete: (() => void) | undefined;
  const writeText = vi.fn().mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        complete = resolve;
      }),
  );
  vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { clipboard: { writeText } }));

  const host = document.createElement('div');
  document.body.append(host);
  dispose = render(() => <ButtonPage />, host);
  flush();

  const copy = host.querySelector<HTMLButtonElement>('.playground button[aria-label="Copy code"]')!;
  const original = host.querySelector('.playground pre code')!.textContent;
  copy.click();

  const label = host.querySelector<HTMLInputElement>('#button-label')!;
  label.value = 'Changed while copying';
  label.dispatchEvent(new Event('input', { bubbles: true }));
  flush();

  complete?.();
  await Promise.resolve();
  flush();

  expect(writeText).toHaveBeenCalledWith(original);
  expect(copy.textContent?.trim()).toBe('Copy');
  expect(host.querySelector('.playground .sr-only[role="status"]')?.textContent).toBe('');
});
