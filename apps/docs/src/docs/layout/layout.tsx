import { useLocation } from '@solidjs/router';
import { type JSX, useHead } from '@solidjs/web';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconClose } from '@wikimedia/codex-icons';
import { createEffect, onSettled } from 'solid-js';
import { pages } from '../navigation';
import { type Theme, themeBootScript } from '../theme';
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
  const page = () => pages.find((item) => item.path === current.pathname.replace(/\/$/, ''));

  let main: HTMLElement | undefined;
  let mobileMenu: HTMLDialogElement | undefined;

  function closeMobileNavigation() {
    if (mobileMenu?.open) {
      mobileMenu.close();
    }
  }

  onSettled(() => {
    const mobile = globalThis.matchMedia?.('(max-width: 760px)');
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (!event.matches) {
        closeMobileNavigation();
      }
    }

    mobile?.addEventListener('change', closeOnDesktop);
    return () => mobile?.removeEventListener('change', closeOnDesktop);
  });

  useHead(() => {
    const home = current.pathname === '/';
    const title = page()?.title ?? 'Page not found';
    const description = page()?.description ?? 'Explore Fern foundations and components.';

    return [
      { tag: 'title', props: { children: home ? 'Fern Docs' : `${title} · Fern Docs` } },
      { tag: 'meta', props: { name: 'description', content: description } },
    ];
  });

  createEffect(
    () => [current.pathname, current.hash] as const,
    ([path, hash], previous) => {
      if (previous) {
        closeMobileNavigation();
      }

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
      <script innerHTML={themeBootScript} />
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
        onOpenNavigation={() => mobileMenu?.showModal()}
      />
      <dialog
        id="mobile-navigation"
        aria-labelledby="mobile-navigation-title"
        class="
          fixed inset-0 m-0 h-dvh w-full max-h-none max-w-none
          flex-col overflow-hidden border-0 p-0 bg-surface-base text-content-base open:flex
        "
        ref={(element) => {
          mobileMenu = element;
        }}
      >
        <div
          class="
            flex h-16 shrink-0 items-center justify-between px-5
            border-b border-line-subtle
          "
        >
          <h2 id="mobile-navigation-title" class="text-base font-semibold">
            Browse docs
          </h2>
          <form method="dialog">
            <button
              class="
                flex size-9 items-center justify-center
                border border-line-subtle rounded-base bg-surface-base text-content-base
              "
              type="submit"
              aria-label="Close navigation"
            >
              <Icon icon={cdxIconClose} />
            </button>
          </form>
        </div>
        <nav
          class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4"
          aria-label="Mobile navigation"
        >
          <DocsNavigation currentPath={page()?.path} onSelect={closeMobileNavigation} />
        </nav>
      </dialog>
      <details class="hidden px-5 border-b border-line-subtle screen-small:no-script:block">
        <summary class="py-3 text-small text-content-base">Browse docs</summary>
        <nav class="py-4" aria-label="Mobile navigation">
          <DocsNavigation currentPath={page()?.path} />
        </nav>
      </details>
      <div
        class="
          grid grid-cols-[232px_minmax(0,792px)_184px] justify-center
          max-w-[1360px] mx-auto screen-narrow:grid-cols-[224px_minmax(0,792px)]
          screen-small:block
        "
      >
        <aside
          class="
            sticky top-18 h-[calc(100dvh-4.5rem)] overflow-y-auto py-10 px-6
            border-r border-line-subtle screen-small:hidden
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
