import { type JSX, render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { afterEach, expect, it, vi } from 'vitest';
import { CodeBlock, Example } from './ui';

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

function mount(view: () => JSX.Element) {
  const host = document.createElement('div');
  document.body.append(host);
  dispose = render(view, host);
  flush();

  return host;
}

function mockClipboard() {
  const writeText = vi.fn<(code: string) => Promise<void>>().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { clipboard: { writeText } }));

  return writeText;
}

it('copies the current code and resets feedback when the code changes', async () => {
  const writeText = mockClipboard();
  let updateCode!: (value: string) => void;

  const host = mount(() => {
    const [code, setCode] = createSignal('First example');
    updateCode = setCode;

    return <CodeBlock code={code()} />;
  });
  const copy = host.querySelector<HTMLButtonElement>('button[aria-label="Copy code"]')!;
  const status = host.querySelector('[role="status"]')!;

  copy.click();

  await vi.waitFor(() => {
    flush();
    expect(copy.textContent?.trim()).toBe('Copied');
  });

  expect(writeText).toHaveBeenCalledWith('First example');
  expect(status.textContent).toBe('Copied');

  updateCode('Second example');
  flush();

  expect(copy.textContent?.trim()).toBe('Copy');
  expect(status.textContent).toBe('');

  copy.click();

  await vi.waitFor(() => {
    flush();
    expect(copy.textContent?.trim()).toBe('Copied');
  });

  expect(writeText).toHaveBeenLastCalledWith('Second example');
});

it('reports clipboard errors with an accessible status', async () => {
  const writeText = mockClipboard();
  writeText.mockRejectedValueOnce(new Error('Clipboard unavailable'));

  const host = mount(() => <CodeBlock code="Example" />);
  host.querySelector<HTMLButtonElement>('button[aria-label="Copy code"]')!.click();

  await vi.waitFor(() => {
    flush();
    expect(host.querySelector('[role="status"]')?.textContent).toBe(
      'Copy unavailable. Select the code to copy it.',
    );
  });
});

it('does not mark changed code as copied when an earlier request finishes', async () => {
  const writeText = mockClipboard();
  let complete!: () => void;
  let updateCode!: (value: string) => void;

  writeText.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        complete = resolve;
      }),
  );

  const host = mount(() => {
    const [code, setCode] = createSignal('Original example');
    updateCode = setCode;

    return <CodeBlock code={code()} />;
  });
  const copy = host.querySelector<HTMLButtonElement>('button[aria-label="Copy code"]')!;

  copy.click();
  updateCode('Changed while copying');
  flush();

  complete();
  await Promise.resolve();
  flush();

  expect(writeText).toHaveBeenCalledWith('Original example');
  expect(copy.textContent?.trim()).toBe('Copy');
  expect(host.querySelector('[role="status"]')?.textContent).toBe('');
});

it('shows and copies demo source without remounting the preview', async () => {
  const writeText = mockClipboard();

  function CounterDemo() {
    const [count, setCount] = createSignal(0);

    return (
      <button id="counter" type="button" onClick={() => setCount((value) => value + 1)}>
        Count {count()}
      </button>
    );
  }

  const source = '<button type="button">Count</button>\n';
  const host = mount(() => <Example demo={{ component: CounterDemo, source }} />);
  const counter = host.querySelector<HTMLButtonElement>('#counter')!;
  const details = host.querySelector('details')!;

  counter.click();
  flush();

  for (const open of [true, false, true]) {
    const toggled = new Promise<void>((resolve) => {
      details.addEventListener('toggle', () => resolve(), { once: true });
    });

    details.open = open;
    await toggled;
    flush();

    expect(host.querySelector('#counter')).toBe(counter);
    expect(counter.textContent?.trim()).toBe('Count 1');
  }

  expect(details.querySelector('pre code')?.textContent).toBe(source);
  details.querySelector<HTMLButtonElement>('button[aria-label="Copy code"]')!.click();

  await vi.waitFor(() => {
    expect(writeText).toHaveBeenCalledWith(source);
  });
});
