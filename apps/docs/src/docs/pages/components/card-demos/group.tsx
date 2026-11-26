import { Card, CardDescription, CardHeader, CardMedia, CardTitle } from '@taxonlabs/fern/card';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconMapPin } from '@wikimedia/codex-icons';
import { createUniqueId, For, Show } from 'solid-js';

const pages = [
  {
    slug: 'Ashtamudi_Lake',
    title: 'Ashtamudi Lake',
    description: 'A lake and wetland in Kerala.',
    image: '/images/ashtamudi-mangrove.jpg',
  },
  {
    slug: 'Kollam',
    title: 'Kollam',
    description: 'A coastal city on the shores of Ashtamudi Lake.',
  },
  {
    slug: 'Munroe_Island',
    title: 'Munroe Island',
    description: 'A group of islands where the Kallada River meets the lake.',
    image: '/images/munroe-island.jpg',
  },
  {
    slug: 'Thevally_Palace',
    title: 'Thevally Palace',
    description: 'A heritage palace on the banks of the lake.',
  },
];

export default function CardGroupDemo() {
  const groupId = createUniqueId();

  return (
    <section class="grid w-full max-w-2xl gap-3" aria-labelledby={groupId}>
      <h4 id={groupId} class="m-0 text-small font-semibold">
        Nearby pages
      </h4>
      <ul class="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-3 p-0">
        <For each={pages}>
          {(page) => {
            const titleId = `${groupId}-${page.slug}`;

            return (
              <li class="grid">
                <Card
                  as="a"
                  href={`https://en.wikipedia.org/wiki/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-labelledby={titleId}
                >
                  <CardMedia position="inline-start" class="bg-surface-neutral-subtle">
                    <Show when={page.image} fallback={<Icon icon={cdxIconMapPin} />}>
                      {(src) => <img class="block size-full object-cover" src={src()} alt="" />}
                    </Show>
                  </CardMedia>
                  <CardHeader>
                    <CardTitle id={titleId}>{page.title}</CardTitle>
                    <CardDescription>{page.description}</CardDescription>
                  </CardHeader>
                </Card>
              </li>
            );
          }}
        </For>
      </ul>
    </section>
  );
}
