import { render } from '@solidjs/web';
import { flush } from 'solid-js';
import ts from 'typescript';
import { afterEach, expect, it } from 'vitest';
import ButtonPage from './button.mdx';

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  document.body.innerHTML = '';
});

function mount() {
  const host = document.createElement('div');
  document.body.append(host);
  dispose = render(() => <ButtonPage />, host);
  flush();

  return host;
}

it('keeps the playground preview and code reactive', () => {
  const host = mount();

  expect(host.querySelector('p p')).toBeNull();
  expect(host.querySelector('summary p')).toBeNull();

  const playground = host.querySelector('.playground')!;
  const variant = playground.querySelector<HTMLSelectElement>('#button-variant')!;
  const action = playground.querySelector<HTMLSelectElement>('#button-action')!;

  expect(playground.querySelector('pre code')?.textContent).toBe(
    '<Button>\n  Save changes\n</Button>',
  );

  variant.value = 'surface';
  variant.dispatchEvent(new Event('change', { bubbles: true }));
  action.value = 'destructive';
  action.dispatchEvent(new Event('change', { bubbles: true }));
  flush();

  expect(playground.querySelector('button')?.className).toContain('fern-button-variant--surface');
  expect(playground.querySelector('button')?.className).toContain(
    'fern-button-action--destructive',
  );
  expect(playground.querySelector('code')?.textContent).toBe(
    '<Button variant="surface" action="destructive">\n  Save changes\n</Button>',
  );

  playground.querySelector('button')?.click();
  flush();

  expect(playground.querySelector('[role="status"]')?.textContent).toBe('Clicked 1 time');

  const checkbox = playground.querySelector<HTMLInputElement>('input[type="checkbox"]')!;

  checkbox.click();
  flush();

  expect(playground.querySelector('button')?.disabled).toBe(true);
});

it('associates native labels with playground controls', () => {
  const host = mount();

  for (const id of [
    'button-variant',
    'button-action',
    'button-size',
    'button-label',
    'button-icon',
  ]) {
    const control = host.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)!;
    expect(control.labels).toHaveLength(1);
    expect(control.labels?.[0].htmlFor).toBe(id);
  }
});

it('preserves the selected size when switching between text and icon-only modes', () => {
  const host = mount();

  const size = host.querySelector<HTMLSelectElement>('#button-size')!;
  const icon = host.querySelector<HTMLSelectElement>('#button-icon')!;
  const playground = host.querySelector('.playground')!;

  for (const value of ['sm', 'lg', 'default']) {
    size.value = value;
    size.dispatchEvent(new Event('change', { bubbles: true }));

    for (const mode of ['only', 'start', 'none']) {
      icon.value = mode;
      icon.dispatchEvent(new Event('change', { bubbles: true }));
      flush();

      const expectedSize =
        mode === 'only' ? (value === 'default' ? 'icon' : `icon-${value}`) : value;
      const button = playground.querySelector('button')!;
      const code = playground.querySelector('pre code')!.textContent!;

      expect(size.value).toBe(value);
      expect(button.classList.contains(`fern-button-size--${expectedSize}`)).toBe(
        expectedSize !== 'default',
      );
      expect(code.includes(`size="${expectedSize}"`)).toBe(expectedSize !== 'default');
      expect(button.getAttribute('aria-label')).toBe(mode === 'only' ? 'Save changes' : null);
      expect(button.querySelectorAll('svg')).toHaveLength(mode === 'none' ? 0 : 1);
    }
  }
});

it('generates valid TSX for labels with quotes and JSX characters in every icon mode', () => {
  const host = mount();

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
