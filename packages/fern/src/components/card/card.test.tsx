import { render } from '@solidjs/web';
import { createSignal, flush, Show } from 'solid-js';
import { expect, it } from 'vitest';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  type CardMediaPosition,
  CardTitle,
} from './card';

it('renders a static card and lets the caller opt into a heading', () => {
  const host = document.createElement('div');
  const [heading, setHeading] = createSignal<'h2' | undefined>();
  const dispose = render(
    () => (
      <Card class={['custom-card', { compact: true }]}>
        <CardHeader>
          <CardTitle as={heading()} id="review-title">
            Review edits
          </CardTitle>
          <CardDescription>Check the latest changes.</CardDescription>
        </CardHeader>
        <CardContent>One edit is pending.</CardContent>
        <CardFooter>
          <button type="button">Open queue</button>
        </CardFooter>
      </Card>
    ),
    host,
  );

  try {
    flush();
    const card = host.firstElementChild as HTMLDivElement;
    expect(card.tagName).toBe('DIV');
    expect(card.tabIndex).toBe(-1);
    expect(card.matches('.fern-card.custom-card.compact')).toBe(true);
    expect(card.querySelector('div#review-title')?.textContent).toBe('Review edits');
    expect(card.querySelector('div.fern-card-description')?.textContent).toBe(
      'Check the latest changes.',
    );
    expect(card.querySelector('.fern-card-content')?.textContent).toBe('One edit is pending.');
    expect(card.querySelector('.fern-card-footer > button')?.textContent).toBe('Open queue');

    setHeading('h2');
    flush();

    expect(card.querySelector('h2#review-title')?.textContent).toBe('Review edits');
  } finally {
    dispose();
  }
});

it('forwards native link props and the ref', () => {
  const host = document.createElement('div');
  let linkRef: HTMLAnchorElement | undefined;
  const dispose = render(
    () => (
      <Card
        as="a"
        href="/wiki/Ashtamudi_Lake"
        target="_blank"
        rel="noopener noreferrer"
        aria-labelledby="lake-title"
        ref={(element) => {
          linkRef = element;
        }}
      >
        <CardTitle id="lake-title">Ashtamudi Lake</CardTitle>
      </Card>
    ),
    host,
  );

  try {
    flush();
    const link = host.querySelector<HTMLAnchorElement>('a[href="/wiki/Ashtamudi_Lake"]')!;
    expect(linkRef).toBe(link);
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
    expect(link.tabIndex).toBe(0);
    expect(link.getAttribute('aria-labelledby')).toBe('lake-title');
  } finally {
    dispose();
  }
});

it('updates the media and position without replacing the card content', () => {
  const host = document.createElement('div');
  const [source, setSource] = createSignal<string | undefined>();
  const [position, setPosition] = createSignal<CardMediaPosition | undefined>();
  let mediaRef: HTMLDivElement | undefined;
  const dispose = render(
    () => (
      <Card>
        <Show when={source()}>
          <CardMedia
            position={position()}
            class={['thumbnail']}
            ref={(element) => {
              mediaRef = element;
            }}
          >
            <img src={source()} alt="" />
          </CardMedia>
        </Show>
        <CardTitle>Ashtamudi Lake</CardTitle>
      </Card>
    ),
    host,
  );

  try {
    flush();
    const card = host.querySelector('.fern-card')!;
    const title = card.querySelector('.fern-card-title');
    expect(title?.textContent).toBe('Ashtamudi Lake');
    expect(card.firstElementChild).toBe(title);

    setSource('/lake.jpg');
    flush();

    const media = card.firstElementChild!;
    expect(media).toBe(mediaRef);
    expect(media.matches('.fern-card-media-position--block-start.thumbnail')).toBe(true);
    expect(media.querySelector('img')?.getAttribute('src')).toBe('/lake.jpg');

    setPosition('inline-start');
    flush();

    expect(media.matches('.fern-card-media-position--inline-start')).toBe(true);

    setSource('/mangrove.jpg');
    setPosition('inline-end');
    flush();

    expect(card.firstElementChild).toBe(media);
    expect(media.matches('.fern-card-media-position--inline-end')).toBe(true);
    expect(media.querySelector('img')?.getAttribute('src')).toBe('/mangrove.jpg');
    expect(card.querySelector('.fern-card-title')).toBe(title);

    setSource(undefined);
    flush();

    expect(card.firstElementChild).toBe(title);
  } finally {
    dispose();
  }
});
