import { type JSX, render } from '@solidjs/web';
import { cdxIconEllipsis } from '@wikimedia/codex-icons';
import { createSignal, flush } from 'solid-js';
import { expect, it, vi } from 'vitest';
import { Icon } from '../icon/icon';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  AvatarStatus,
  type AvatarStatusValue,
} from './avatar';

it('renders fallback content without an image source', () => {
  const host = document.createElement('div');
  const dispose = render(
    () => (
      <>
        <Avatar>
          <AvatarImage src="" />
        </Avatar>
        <Avatar>
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
      </>
    ),
    host,
  );

  try {
    flush();
    expect(host.querySelector('img')).toBeNull();
    expect(
      host.querySelector('.fern-avatar-default-fallback svg[aria-hidden="true"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('.fern-avatar-fallback:not(.fern-avatar-default-fallback)')?.textContent,
    ).toBe('AM');
  } finally {
    dispose();
  }
});

it('shows the fallback on error and retries when the source changes', () => {
  const host = document.createElement('div');
  const [src, setSrc] = createSignal('/missing.jpg');
  const onError = vi.fn();
  const onLoad = vi.fn();
  let imageRef: HTMLImageElement | undefined;
  const dispose = render(
    () => (
      <Avatar role="img" aria-label="Alex Miller">
        <AvatarImage
          src={src()}
          class={['portrait', { rounded: true }]}
          onError={onError}
          onLoad={onLoad}
          ref={(element) => {
            imageRef = element;
          }}
        />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
    ),
    host,
  );

  try {
    flush();
    const failedImage = host.querySelector('img')!;

    expect(imageRef).toBe(failedImage);
    expect([...failedImage.classList]).toEqual(['fern-avatar-image', 'portrait', 'rounded']);
    expect(failedImage.hidden).toBe(false);

    failedImage.dispatchEvent(new Event('error'));
    flush();

    expect(failedImage.hidden).toBe(true);
    expect(onError).toHaveBeenCalledOnce();
    expect(host.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Alex Miller');

    setSrc('/portrait.jpg');
    flush();
    const nextImage = host.querySelector('img')!;
    failedImage.dispatchEvent(new Event('error'));
    flush();

    expect(nextImage.getAttribute('src')).toBe('/portrait.jpg');
    expect(nextImage.hidden).toBe(false);

    nextImage.dispatchEvent(new Event('load'));
    flush();

    expect(onLoad).toHaveBeenCalledOnce();
  } finally {
    dispose();
  }
});

it('recognizes an image that failed before its listeners were attached', () => {
  const host = document.createElement('div');
  const dispose = render(
    () => (
      <Avatar>
        <AvatarImage
          src="/missing.jpg"
          ref={(image) => {
            Object.defineProperty(image, 'complete', { value: true });
          }}
        />
      </Avatar>
    ),
    host,
  );

  try {
    flush();
    expect(host.querySelector('img')?.hidden).toBe(true);
  } finally {
    dispose();
  }
});

it('renders a named group with an individual size and supports status and count content', () => {
  const host = document.createElement('div');
  const [status, setStatus] = createSignal<AvatarStatusValue>();
  const [withIcon, setWithIcon] = createSignal(false);
  const dispose = render(
    () => (
      <AvatarGroup aria-label="Recent contributors">
        <Avatar>
          <AvatarStatus status={status()} />
        </Avatar>
        <Avatar size="sm" />
        <AvatarGroupCount>{withIcon() ? <Icon icon={cdxIconEllipsis} /> : '+3'}</AvatarGroupCount>
      </AvatarGroup>
    ),
    host,
  );

  try {
    flush();
    const group = host.querySelector('[role="group"]')!;
    const [defaultAvatar, smallAvatar, count] = group.children;
    const dot = defaultAvatar.querySelector('.fern-avatar-status')!;

    expect(group.getAttribute('aria-label')).toBe('Recent contributors');
    expect(defaultAvatar.className).toBe('fern-avatar');
    expect(smallAvatar.classList.contains('fern-avatar-size--sm')).toBe(true);
    expect(count.textContent).toBe('+3');
    expect(dot.getAttribute('aria-hidden')).toBe('true');
    expect(dot.classList.contains('fern-avatar-status--online')).toBe(true);

    setStatus('busy');
    setWithIcon(true);
    flush();

    expect(dot.classList.contains('fern-avatar-status--busy')).toBe(true);
    expect(count.querySelector('svg')).not.toBeNull();
  } finally {
    dispose();
  }
});

it('forwards polymorphic link props and keeps the default button from submitting a form', () => {
  function Link(props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return <a {...props} data-custom-link="" />;
  }

  const host = document.body.appendChild(document.createElement('div'));
  const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
  const onClick = vi.fn();
  const dispose = render(
    () => (
      <form onSubmit={onSubmit}>
        <Avatar as="a" href="/editors/alex-miller" aria-label="Alex Miller" />
        <Avatar
          as={Link}
          href="/editors/sam-rivera"
          aria-label="Sam Rivera"
          class={['profile-link']}
        />
        <Avatar as="button" aria-label="Show account menu" onClick={onClick} />
        <Avatar as="button" type="submit" aria-label="Submit profile" />
      </form>
    ),
    host,
  );

  try {
    flush();
    expect(host.querySelector('a[href="/editors/alex-miller"]')).not.toBeNull();
    expect(host.querySelector('a[data-custom-link].profile-link')?.getAttribute('href')).toBe(
      '/editors/sam-rivera',
    );
    const [button, submit] = host.querySelectorAll('button');

    expect(button.type).toBe('button');
    button.click();
    expect(onClick).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();

    submit.click();
    expect(onSubmit).toHaveBeenCalledOnce();
  } finally {
    dispose();
    host.remove();
  }
});
