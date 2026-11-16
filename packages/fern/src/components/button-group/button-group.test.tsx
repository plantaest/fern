import { render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { expect, it, vi } from 'vitest';
import { Button } from '../button/button';
import { ButtonGroup, type ButtonGroupOrientation } from './button-group';

it('renders a named group and updates its orientation without replacing its children', () => {
  const [orientation, setOrientation] = createSignal<ButtonGroupOrientation | undefined>();
  const host = document.createElement('div');
  let ref: HTMLDivElement | undefined;
  const dispose = render(
    () => (
      <ButtonGroup
        aria-label="Export results"
        orientation={orientation()}
        class="example"
        style={{ 'max-width': '16rem' }}
        ref={(element) => {
          ref = element;
        }}
      >
        <Button>CSV</Button>
        <Button>JSON</Button>
      </ButtonGroup>
    ),
    host,
  );

  try {
    flush();
    const group = host.querySelector<HTMLDivElement>('div[role="group"]')!;
    const firstButton = group.firstElementChild;
    const verticalClass = 'fern-button-group-orientation--vertical';

    expect(group.getAttribute('aria-label')).toBe('Export results');
    expect(ref).toBe(group);
    expect(group.style.maxWidth).toBe('16rem');
    expect(group.tabIndex).toBe(-1);
    expect(group.classList.contains('fern-button-group')).toBe(true);
    expect(group.classList.contains(verticalClass)).toBe(false);

    setOrientation('vertical');
    flush();

    expect(group.classList.contains(verticalClass)).toBe(true);
    expect(group.classList.contains('example')).toBe(true);
    expect(group.firstElementChild).toBe(firstButton);
  } finally {
    dispose();
  }
});

it('preserves button, disabled button, and link behavior', () => {
  const onAction = vi.fn();
  const onDisabledAction = vi.fn();
  const onLink = vi.fn((event: MouseEvent) => event.preventDefault());
  const host = document.body.appendChild(document.createElement('div'));
  const dispose = render(
    () => (
      <>
        <span id="actions">Page actions</span>
        <ButtonGroup aria-labelledby="actions">
          <Button onClick={onAction}>Run</Button>
          <Button disabled onClick={onDisabledAction}>
            Unavailable
          </Button>
          <Button as="a" href="/details" onClick={onLink}>
            Details
          </Button>
        </ButtonGroup>
      </>
    ),
    host,
  );

  try {
    flush();
    const group = host.querySelector('[role="group"]')!;
    const [button, disabledButton] = group.querySelectorAll('button');
    const link = group.querySelector('a')!;

    expect(group.getAttribute('aria-labelledby')).toBe('actions');
    expect(button.type).toBe('button');
    expect(disabledButton.disabled).toBe(true);
    expect(link.getAttribute('href')).toBe('/details');

    button.click();
    disabledButton.click();
    link.click();

    expect(onAction).toHaveBeenCalledOnce();
    expect(onDisabledAction).not.toHaveBeenCalled();
    expect(onLink).toHaveBeenCalledOnce();
  } finally {
    dispose();
    host.remove();
  }
});
