import { useLocation } from '@solidjs/router';
import { For, Show } from 'solid-js';
import { pageGroups, pages, sectionId } from '../navigation';

export function DocsNavigation(props: { currentPath?: string; onSelect?: () => void }) {
  return (
    <For each={pageGroups}>
      {(group) => (
        <div class="[&+&]:mt-8 screen-small:[&+&]:mt-5">
          <p class="text-extra-small font-semibold text-content-subtle mx-3 mb-3">{group}</p>
          <For each={pages.filter((item) => item.group === group)}>
            {(item) => (
              <a
                class="
                  block py-2 px-3 my-0.5 rounded-base
                  text-small text-content-base hover:bg-surface-interactive-subtle-hover
                  no-underline aria-[current=page]:bg-surface-progressive-subtle
                  aria-[current=page]:text-content-progressive aria-[current=page]:font-medium
                "
                href={item.path}
                aria-current={props.currentPath === item.path ? 'page' : undefined}
                onClick={props.onSelect}
              >
                {item.title}
              </a>
            )}
          </For>
        </div>
      )}
    </For>
  );
}

export function TableOfContents(props: { sections: readonly string[] }) {
  const current = useLocation();

  return (
    <Show when={props.sections.length}>
      <aside
        class="
          sticky top-18 h-fit py-10 px-6 text-extra-small
          screen-narrow:hidden
        "
      >
        <nav aria-label="On this page">
          <p class="font-semibold mb-3">On this page</p>
          <For each={props.sections}>
            {(title) => {
              const id = sectionId(title);

              return (
                <a
                  class="block text-content-subtle py-1.5 no-underline hover:underline hover:text-content-progressive"
                  href={`${current.pathname}#${id}`}
                  aria-current={
                    current.hash === `#${encodeURIComponent(id)}` ? 'location' : 'false'
                  }
                >
                  {title}
                </a>
              );
            }}
          </For>
        </nav>
      </aside>
    </Show>
  );
}
