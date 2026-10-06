import { useLocation } from '@solidjs/router';
import type { JSX } from '@solidjs/web';
import { createEffect, createSignal, Show } from 'solid-js';
import { pages } from '../navigation';
import type { Theme } from '../theme';
import { Header } from './header';
import { DocsNavigation, TableOfContents } from './navigation';

function fragmentId(hash: string) {
  const id = hash.slice(1);

  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

export function Layout(props: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  children: JSX.Element;
}) {
  const current = useLocation();
  const [menuOpen, setMenuOpen] = createSignal(false);
  const page = () => pages.find((item) => item.path === current.pathname.replace(/\/$/, ''));

  let main: HTMLElement | undefined;

  createEffect(
    () => page()?.title ?? 'Page not found',
    (title) => {
      document.title = `${title} · Fern Docs`;
    },
  );

  createEffect(
    () => [current.pathname, current.hash] as const,
    ([path, hash], previous) => {
      setMenuOpen(false);

      const frame = requestAnimationFrame(() => {
        // Initial fragments may arrive before the client has rendered the page.
        if (!previous && hash) {
          document.getElementById(fragmentId(hash))?.scrollIntoView({ block: 'start' });
        }

        if (hash === '#main' || (previous && path !== previous[0])) {
          main?.focus({ preventScroll: true });
        }
      });

      return () => cancelAnimationFrame(frame);
    },
  );

  return (
    <div class="fern fern-docs min-h-screen" data-theme={props.theme}>
      <a
        class="
          fixed top-[-6.25rem] left-4 z-20 px-4 py-2 bg-surface-base
          border border-line-base text-content-progressive no-underline hover:underline focus:top-2
        "
        href={`${current.pathname}#main`}
      >
        Skip to content
      </a>
      <Header
        theme={props.theme}
        onThemeChange={props.onThemeChange}
        menuOpen={menuOpen()}
        onMenuToggle={() => setMenuOpen((value) => !value)}
      />
      <Show when={menuOpen()}>
        <nav
          id="mobile-navigation"
          class="
            hidden py-6 px-5 border-b border-line-subtle
            screen-small:block
          "
          aria-label="Mobile navigation"
        >
          <DocsNavigation currentPath={page()?.path} onSelect={() => setMenuOpen(false)} />
        </nav>
      </Show>
      <div
        class="
          grid grid-cols-[216px_minmax(0,792px)_184px] justify-center
          max-w-[1360px] mx-auto screen-narrow:grid-cols-[200px_minmax(0,792px)]
          screen-small:block
        "
      >
        <aside
          class="
            sticky top-18 h-[calc(100vh-4.5rem)] py-10 px-6
            border-r border-line-subtle flex flex-col screen-small:hidden
          "
        >
          <nav aria-label="Main navigation">
            <DocsNavigation currentPath={page()?.path} />
          </nav>
        </aside>
        <main
          class="
            flex flex-col min-w-0 min-h-[calc(100dvh-4.5rem)]
            px-12 pt-10 outline-none screen-narrow:px-9
            screen-small:min-h-[calc(100dvh-4rem)]
            screen-small:px-5 screen-small:pt-8
          "
          id="main"
          tabindex="-1"
          ref={(element) => {
            main = element;
          }}
        >
          <div class="flex-1">{props.children}</div>
          <footer
            class="
              border-t border-line-subtle text-content-subtle text-extra-small py-6 mt-16
            "
          >
            Fern · Taxon Labs
          </footer>
        </main>
        <TableOfContents sections={page()?.sections ?? []} />
      </div>
    </div>
  );
}
