import { render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import {
  Progress,
  type ProgressColor,
  ProgressLabel,
  type ProgressSize,
  ProgressValue,
} from './progress';

it('renders a named progressbar with a default range and reactive size and color', () => {
  const [size, setSize] = createSignal<ProgressSize>();
  const [color, setColor] = createSignal<ProgressColor>();
  const host = document.createElement('div');
  let ref: HTMLDivElement | undefined;
  const dispose = render(
    () => (
      <>
        <span id="export-label">Export data</span>
        <Progress
          id="export-progress"
          aria-labelledby="export-label"
          color={color()}
          size={size()}
          class={['custom', { compact: size() === 'sm' }]}
          ref={(element) => {
            ref = element;
          }}
        />
      </>
    ),
    host,
  );

  try {
    flush();
    const progress = host.querySelector('[role="progressbar"]')!;
    const container = progress.parentElement!;

    expect(ref).toBe(progress);
    expect(progress.id).toBe('export-progress');
    expect(progress.getAttribute('aria-labelledby')).toBe('export-label');
    expect(progress.getAttribute('aria-valuemin')).toBe('0');
    expect(progress.getAttribute('aria-valuemax')).toBe('100');
    expect([...container.classList]).toEqual(['fern-progress', 'custom']);

    setSize('sm');
    setColor('warning');
    flush();

    expect(new Set(container.classList)).toEqual(
      new Set([
        'fern-progress',
        'fern-progress-color--warning',
        'fern-progress-size--sm',
        'custom',
        'compact',
      ]),
    );
    expect(progress.hasAttribute('color')).toBe(false);

    setSize('lg');
    setColor('progressive');
    flush();

    expect(new Set(container.classList)).toEqual(
      new Set(['fern-progress', 'fern-progress-size--lg', 'custom']),
    );
  } finally {
    dispose();
  }
});

it('links composed labels and updates the visible and accessible counts', () => {
  const [value, setValue] = createSignal<number | undefined>(42);
  const [accessibleValue, setAccessibleValue] = createSignal<string | undefined>(
    '42 of 120 pages processed',
  );
  const host = document.createElement('div');
  const dispose = render(
    () => (
      <Progress
        value={value()}
        max={120}
        getValueLabel={({ value, max }) => `${value} / ${max}`}
        aria-valuetext={accessibleValue()}
      >
        <ProgressLabel>Pages processed</ProgressLabel>
        <ProgressValue />
      </Progress>
    ),
    host,
  );

  try {
    flush();
    const progress = host.querySelector('[role="progressbar"]')!;
    const [label, output] = host.querySelectorAll('span');
    const indicator = host.querySelector<HTMLElement>('.fern-progress-indicator')!;

    expect(label.textContent).toBe('Pages processed');
    expect(progress.getAttribute('aria-labelledby')).toBe(label.id);
    expect(output.textContent).toBe('42 / 120');
    expect(progress.getAttribute('aria-valuetext')).toBe('42 of 120 pages processed');
    expect(indicator.style.inlineSize).toBe('35%');

    setValue(60);
    setAccessibleValue(undefined);
    flush();

    expect(output.textContent).toBe('60 / 120');
    expect(progress.getAttribute('aria-valuetext')).toBe('60 / 120');
    expect(indicator.style.inlineSize).toBe('50%');

    setValue(undefined);
    flush();

    expect(output.textContent).toBe('');
    expect(progress.hasAttribute('aria-valuetext')).toBe(false);
  } finally {
    dispose();
  }
});

it('transitions between unknown and measured progress on the same element', () => {
  const [value, setValue] = createSignal<number>();
  const host = document.createElement('div');
  const dispose = render(
    () => (
      <Progress max={120} value={value()} aria-label="Export data">
        <ProgressValue />
      </Progress>
    ),
    host,
  );

  try {
    flush();
    const progress = host.querySelector('[role="progressbar"]')!;
    const output = host.querySelector('span')!;

    expect(progress.getAttribute('aria-valuemax')).toBe('120');
    expect(progress.getAttribute('aria-label')).toBe('Export data');
    expect(progress.hasAttribute('aria-labelledby')).toBe(false);
    expect(progress.hasAttribute('aria-valuenow')).toBe(false);

    setValue(0);
    flush();
    expect(progress.getAttribute('aria-valuenow')).toBe('0');

    setValue(42);
    flush();
    expect(progress.getAttribute('aria-valuenow')).toBe('42');
    expect(output.textContent).toBe('35%');

    setValue(undefined);
    flush();
    expect(host.querySelector('[role="progressbar"]')).toBe(progress);
    expect(progress.hasAttribute('aria-valuenow')).toBe(false);
  } finally {
    dispose();
  }
});

it('lets indeterminate progress override a measured value until cleared', () => {
  const [indeterminate, setIndeterminate] = createSignal(true);
  const host = document.createElement('div');
  const dispose = render(
    () => (
      <Progress
        aria-label="Export progress"
        value={42}
        indeterminate={indeterminate()}
        getValueLabel={({ value }) => `${value} pages processed`}
      >
        <ProgressValue />
      </Progress>
    ),
    host,
  );

  try {
    flush();
    const progress = host.querySelector('[role="progressbar"]')!;

    expect(progress.hasAttribute('data-indeterminate')).toBe(true);
    expect(progress.hasAttribute('aria-valuenow')).toBe(false);
    expect(progress.hasAttribute('aria-valuetext')).toBe(false);
    expect(host.querySelector('span')?.textContent).toBe('');

    setIndeterminate(false);
    flush();

    expect(progress.hasAttribute('data-indeterminate')).toBe(false);
    expect(progress.getAttribute('aria-valuenow')).toBe('42');
    expect(progress.getAttribute('aria-valuetext')).toBe('42 pages processed');
    expect(host.querySelector('span')?.textContent).toBe('42 pages processed');
  } finally {
    dispose();
  }
});

it('reflects disabled state without changing the progress value', () => {
  const [disabled, setDisabled] = createSignal(false);
  const host = document.createElement('div');
  const dispose = render(() => <Progress value={42} disabled={disabled()} />, host);

  try {
    flush();
    const progress = host.querySelector('[role="progressbar"]')!;

    expect(progress.hasAttribute('aria-disabled')).toBe(false);

    setDisabled(true);
    flush();
    expect(progress.getAttribute('aria-disabled')).toBe('true');
    expect(progress.getAttribute('aria-valuenow')).toBe('42');

    setDisabled(false);
    flush();
    expect(progress.hasAttribute('aria-disabled')).toBe(false);
  } finally {
    dispose();
  }
});

it('measures progress from a reactive starting value and formats the original range', () => {
  const [min, setMin] = createSignal(200);
  const host = document.createElement('div');
  const dispose = render(
    () => (
      <Progress
        value={350}
        min={min()}
        max={500}
        getValueLabel={({ value, min, max }) => `${value} (${min}–${max})`}
      >
        <ProgressValue />
      </Progress>
    ),
    host,
  );

  try {
    flush();
    const progress = host.querySelector('[role="progressbar"]')!;
    const indicator = host.querySelector<HTMLElement>('.fern-progress-indicator')!;

    expect(progress.getAttribute('aria-valuemin')).toBe('200');
    expect(progress.getAttribute('aria-valuemax')).toBe('500');
    expect(progress.getAttribute('aria-valuenow')).toBe('350');
    expect(indicator.style.inlineSize).toBe('50%');
    expect(progress.getAttribute('aria-valuetext')).toBe('350 (200–500)');

    setMin(300);
    flush();

    expect(progress.getAttribute('aria-valuemin')).toBe('300');
    expect(progress.getAttribute('aria-valuenow')).toBe('350');
    expect(indicator.style.inlineSize).toBe('25%');
    expect(host.querySelector('span')?.textContent).toBe('350 (300–500)');
  } finally {
    dispose();
  }
});
