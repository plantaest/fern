import { Button } from '@taxonlabs/fern/button';
import { Skeleton } from '@taxonlabs/fern/skeleton';
import { createSignal, For, Show } from 'solid-js';

const articles = [
  { title: 'Vietnamese Wikipedia', description: 'The Vietnamese edition of Wikipedia.' },
  { title: 'Wikimedia Commons', description: 'A repository of freely licensed media.' },
];

const resultLayout = 'flex min-h-12 flex-col justify-center gap-1';

function ResultPlaceholder() {
  return (
    <div class={resultLayout}>
      <Skeleton class="h-3 w-2/5" />
      <Skeleton class="h-3 w-full" />
    </div>
  );
}

export default function SkeletonSearchResultsDemo() {
  const [loading, setLoading] = createSignal(true);

  return (
    <div class="grid w-full max-w-sm gap-4 text-small">
      <section aria-label="Search results" aria-busy={loading() ? 'true' : 'false'}>
        <Show
          when={!loading()}
          fallback={
            <div class="grid gap-3">
              <ResultPlaceholder />
              <ResultPlaceholder />
            </div>
          }
        >
          <ul class="m-0 grid list-none gap-3 p-0">
            <For each={articles}>
              {(article) => (
                <li class={resultLayout}>
                  <p class="font-semibold">{article.title}</p>
                  <p class="text-content-subtle">{article.description}</p>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </section>
      <Button class="justify-self-center" variant="outline" onClick={() => setLoading(!loading())}>
        {loading() ? 'Show results' : 'Show loading state'}
      </Button>
    </div>
  );
}
