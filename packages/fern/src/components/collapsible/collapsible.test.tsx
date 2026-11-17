import { render } from '@solidjs/web';
import { createSignal, flush } from 'solid-js';
import { expect, it, vi } from 'vitest';
import { Button } from '../button/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

it('starts closed, toggles as a button, and preserves the mounted input', () => {
  const host = document.createElement('div');
  const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
  const dispose = render(
    () => (
      <form onSubmit={onSubmit}>
        <Collapsible>
          <CollapsibleTrigger>Advanced filters</CollapsibleTrigger>
          <CollapsibleContent class="grid">
            <input aria-label="Page title" />
          </CollapsibleContent>
        </Collapsible>
      </form>
    ),
    host,
  );

  try {
    flush();
    const trigger = host.querySelector('button')!;
    const panel = host.querySelector<HTMLDivElement>('.fern-collapsible-content')!;
    const input = panel.querySelector('input')!;

    expect(trigger.type).toBe('button');
    expect(trigger.classList.contains('fern-button')).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);

    trigger.click();
    flush();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.id).not.toBe('');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.hidden).toBe(false);
    input.value = 'Hanoi';

    trigger.click();
    flush();
    expect(panel.hidden).toBe(true);

    trigger.click();
    flush();
    expect(panel.hidden).toBe(false);
    expect(host.querySelector('input')).toBe(input);
    expect(input.value).toBe('Hanoi');
    expect(onSubmit).not.toHaveBeenCalled();
  } finally {
    dispose();
  }
});

it('opens initially when defaultOpen is set', () => {
  const host = document.createElement('div');
  const dispose = render(
    () => (
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Details about the page</CollapsibleContent>
      </Collapsible>
    ),
    host,
  );

  try {
    flush();

    expect(host.querySelector('button')?.getAttribute('aria-expanded')).toBe('true');
    expect(host.querySelector<HTMLDivElement>('.fern-collapsible-content')?.hidden).toBe(false);
  } finally {
    dispose();
  }
});

it('follows controlled state and combines root and trigger disabled props', () => {
  const host = document.createElement('div');
  const [open, setOpen] = createSignal(false);
  const [rootDisabled, setRootDisabled] = createSignal(false);
  const [triggerDisabled, setTriggerDisabled] = createSignal(false);
  const onOpenChange = vi.fn();
  const dispose = render(
    () => (
      <Collapsible open={open()} onOpenChange={onOpenChange} disabled={rootDisabled()}>
        <CollapsibleTrigger as={Button} variant="soft" disabled={triggerDisabled()}>
          Details
        </CollapsibleTrigger>
        <CollapsibleContent id="details-panel">Details about the page</CollapsibleContent>
      </Collapsible>
    ),
    host,
  );

  try {
    flush();
    const trigger = host.querySelector('button')!;
    const panel = host.querySelector<HTMLDivElement>('#details-panel')!;

    expect(trigger.classList.contains('fern-button-variant--soft')).toBe(true);

    trigger.click();
    flush();

    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);

    setRootDisabled(true);
    setOpen(true);
    flush();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.hidden).toBe(false);
    expect(trigger.disabled).toBe(true);
    trigger.click();

    setRootDisabled(false);
    setTriggerDisabled(true);
    flush();

    expect(trigger.disabled).toBe(true);
    trigger.click();
    expect(onOpenChange).toHaveBeenCalledTimes(1);

    setTriggerDisabled(false);
    flush();
    trigger.click();
    flush();

    expect(onOpenChange).toHaveBeenNthCalledWith(2, false);
    expect(panel.hidden).toBe(false);

    setOpen(false);
    flush();
    expect(panel.hidden).toBe(true);
  } finally {
    dispose();
  }
});
