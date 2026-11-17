import { type JSX, render } from '@solidjs/web';
import { cdxIconStar, cdxIconSuccess } from '@wikimedia/codex-icons';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { Icon } from '../icon/icon';
import { Badge, type BadgeSize, type BadgeStatus, type BadgeVariant } from './badge';

it('renders a static notice badge and reacts to variant, status, and size changes', () => {
  const [status, setStatus] = createSignal<BadgeStatus | undefined>();
  const [variant, setVariant] = createSignal<BadgeVariant | undefined>();
  const [size, setSize] = createSignal<BadgeSize | undefined>();
  const host = document.createElement('div');
  const dispose = render(
    () => (
      <Badge variant={variant()} status={status()} size={size()} class={['custom']} dir="rtl">
        Reviewed
      </Badge>
    ),
    host,
  );

  try {
    flush();
    const badge = host.querySelector('span')!;

    expect(badge.textContent).toBe('Reviewed');
    expect(badge.dir).toBe('rtl');
    expect(badge.tabIndex).toBe(-1);
    expect(new Set(badge.classList)).toEqual(
      new Set(['fern-badge', 'fern-badge-status--notice', 'fern-badge-variant--soft', 'custom']),
    );

    setVariant('surface');
    setStatus('success');
    setSize('lg');
    flush();

    expect(new Set(badge.classList)).toEqual(
      new Set([
        'fern-badge',
        'fern-badge-status--success',
        'fern-badge-variant--surface',
        'fern-badge-size--lg',
        'custom',
      ]),
    );
    expect(badge.children).toHaveLength(0);
  } finally {
    dispose();
  }
});

it('forwards link props and ref when as changes from an anchor to a component', () => {
  function Link(props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return <a {...props} data-custom-link="" />;
  }

  const [target, setTarget] = createSignal<'a' | typeof Link>('a');
  const host = document.createElement('div');
  let ref: HTMLAnchorElement | undefined;
  const dispose = render(
    () => (
      <Badge
        as={target()}
        href="/foundations/colors"
        ref={(element) => {
          ref = element;
        }}
      >
        Color tokens
      </Badge>
    ),
    host,
  );

  try {
    flush();
    const link = host.querySelector('a[href="/foundations/colors"]');

    expect(link?.textContent).toBe('Color tokens');
    expect(ref).toBe(link);

    setTarget(() => Link);
    flush();

    const customLink = host.querySelector('a[data-custom-link][href="/foundations/colors"]');

    expect(customLink?.textContent).toBe('Color tokens');
    expect(ref).toBe(customLink);
  } finally {
    dispose();
  }
});

it('renders icons before and after a plain text label', () => {
  const host = document.createElement('div');
  const dispose = render(
    () => (
      <Badge status="success">
        <Icon icon={cdxIconSuccess} />
        Reviewed
        <Icon icon={cdxIconStar} />
      </Badge>
    ),
    host,
  );

  try {
    flush();
    const badge = host.querySelector('.fern-badge')!;
    const content = [...badge.childNodes].filter(
      (node) => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim(),
    );

    expect(
      content.map((node) => (node instanceof Element ? node.localName : node.textContent?.trim())),
    ).toEqual(['svg', 'Reviewed', 'svg']);
    expect([...badge.children].map((icon) => icon.getAttribute('aria-hidden'))).toEqual([
      'true',
      'true',
    ]);
  } finally {
    dispose();
  }
});
