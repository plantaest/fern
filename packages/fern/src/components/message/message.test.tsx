import { type JSX, render } from '@solidjs/web';
import { cdxIconArticle } from '@wikimedia/codex-icons';
import { createSignal, flush } from 'solid-js';
import { afterEach, expect, it, vi } from 'vitest';
import { Message, type MessageType } from './message';

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  document.body.innerHTML = '';
});

function mount(view: () => JSX.Element) {
  const host = document.body.appendChild(document.createElement('div'));
  dispose = render(view, host);
  flush();

  return host.querySelector<HTMLDivElement>('.fern-message')!;
}

it('updates the presentation and live announcement when the type changes', () => {
  const [type, setType] = createSignal<MessageType | undefined>();
  const [inline, setInline] = createSignal(false);
  const message = mount(() => (
    <Message type={type()} inline={inline()}>
      <strong>Article title is required.</strong>
    </Message>
  ));
  const icon = message.querySelector('svg')!;
  const noticePath = icon.querySelector('path')?.getAttribute('d');

  expect(message.classList.contains('fern-message-type--notice')).toBe(true);
  expect(message.classList.contains('fern-message-layout--block')).toBe(true);
  expect(noticePath).toBeTruthy();
  expect(icon.getAttribute('aria-hidden')).toBe('true');
  expect(message.getAttribute('aria-live')).toBe('polite');
  expect(message.hasAttribute('role')).toBe(false);

  setType('error');
  setInline(true);
  flush();

  expect(message.classList.contains('fern-message-type--error')).toBe(true);
  expect(message.classList.contains('fern-message-layout--inline')).toBe(true);
  expect(message.classList.contains('fern-message-layout--block')).toBe(false);
  expect(message.querySelector('svg path')?.getAttribute('d')).not.toBe(noticePath);
  expect(message.getAttribute('role')).toBe('alert');
  expect(message.hasAttribute('aria-live')).toBe(false);
  expect(message.querySelector('strong')?.textContent).toBe('Article title is required.');

  setType('warning');
  flush();

  expect(message.hasAttribute('role')).toBe(false);
  expect(message.getAttribute('aria-live')).toBe('polite');
});

it('keeps the custom icon when the type changes and restores the type icon when cleared', () => {
  const [type, setType] = createSignal<MessageType>('notice');
  const [customIcon, setCustomIcon] = createSignal<typeof cdxIconArticle>();
  const message = mount(() => (
    <Message type={type()} icon={customIcon()}>
      Draft available.
    </Message>
  ));
  const iconMarkup = () => message.querySelector('svg')?.innerHTML;
  const noticeIcon = iconMarkup();

  setCustomIcon(cdxIconArticle);
  flush();

  const articleIcon = iconMarkup();
  expect(articleIcon).not.toBe(noticeIcon);

  setType('error');
  flush();
  expect(iconMarkup()).toBe(articleIcon);

  setCustomIcon(undefined);
  flush();

  expect(iconMarkup()).not.toBe(articleIcon);
});

it('requests closing from a named button in block layout without removing the message', () => {
  const [inline, setInline] = createSignal(false);
  const [label, setLabel] = createSignal<string>();
  const onClose = vi.fn();
  const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
  const message = mount(() => (
    <form onSubmit={onSubmit}>
      <Message
        title="Search failed"
        inline={inline()}
        withCloseButton
        closeButtonLabel={label()}
        onClose={onClose}
      >
        Try again.
      </Message>
    </form>
  ));
  const button = message.querySelector('button')!;

  expect(message.firstElementChild?.nextElementSibling?.textContent).toBe(
    'Search failedTry again.',
  );
  expect(message.hasAttribute('title')).toBe(false);
  expect(button.getAttribute('aria-label')).toBe('Close');

  setLabel('Close search message');
  flush();

  expect(button.getAttribute('aria-label')).toBe('Close search message');
  button.click();
  flush();

  expect(onClose).toHaveBeenCalledOnce();
  expect(onSubmit).not.toHaveBeenCalled();
  expect(message.isConnected).toBe(true);

  setInline(true);
  flush();

  expect(message.querySelector('button')).toBeNull();
});

it('forwards native attributes, events, and refs', () => {
  let ref: HTMLDivElement | undefined;
  const onClick = vi.fn();
  const message = mount(() => (
    <Message
      id="save-status"
      class="custom-message"
      role="status"
      aria-live="off"
      aria-atomic="true"
      onClick={onClick}
      ref={(element) => {
        ref = element;
      }}
    >
      Changes saved.
    </Message>
  ));

  expect(ref).toBe(message);
  expect(message.id).toBe('save-status');
  expect(message.classList.contains('custom-message')).toBe(true);
  expect(message.getAttribute('role')).toBe('status');
  expect(message.getAttribute('aria-live')).toBe('off');
  expect(message.getAttribute('aria-atomic')).toBe('true');

  message.click();
  expect(onClick).toHaveBeenCalledOnce();
});
