import { createRouter, useLocation, useNavigate } from '@solidjs/router';
import { Dynamic, type JSX } from '@solidjs/web';
import { buttonVariants } from '@taxon-labs/fern/button';
import { Icon } from '@taxon-labs/fern/icon';
import { cdxIconClose, cdxIconLightbulb, cdxIconMenu, cdxIconMoon } from '@wikimedia/codex-icons';
import { createEffect, createSignal, For, onSettled, Show } from 'solid-js';
import { PageIntro, sectionId } from './docs';
import { pageGroups, pages } from './navigation';

type Theme = 'light' | 'dark';

function savedTheme(): Theme {
  try {
    return localStorage.getItem('fern-docs-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function App() {
  const [theme, setTheme] = createSignal<Theme>(savedTheme());

  const DocsRouter = createRouter({
    routes: [
      { path: '/', component: HomeRedirect },
      ...pages.map((page) => ({
        path: page.path,
        component: () => <Dynamic component={page.component} theme={theme()} />,
      })),
      { path: '*404', component: NotFound },
    ],
  });

  createEffect(
    () => theme(),
    (value) => {
      try {
        localStorage.setItem('fern-docs-theme', value);
      } catch {
        /* The theme still works without storage. */
      }
    },
  );

  return (
    <DocsRouter>
      {(props) => (
        <Layout theme={theme()} onThemeChange={setTheme}>
          {props.children}
        </Layout>
      )}
    </DocsRouter>
  );
}

function HomeRedirect() {
  const navigate = useNavigate();
  const current = useLocation();

  onSettled(() =>
    navigate(`/foundations/colors${current.search}${current.hash}`, { replace: true }),
  );

  return null;
}

function NotFound() {
  return (
    <>
      <PageIntro
        category="404"
        title="Page not found"
        description="We couldn't find this page. Choose a page from the navigation or return to Colors."
      />
      <a href="/foundations/colors" class={buttonVariants({ variant: 'outline' })}>
        Explore colors
      </a>
    </>
  );
}

function Layout(props: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  children: JSX.Element;
}) {
  const current = useLocation();
  const [menuOpen, setMenuOpen] = createSignal(false);
  const page = () => pages.find((item) => item.path === current.pathname.replace(/\/$/, ''));

  let main: HTMLElement | undefined;

  createEffect(
    () => [current.pathname, current.hash] as const,
    ([path, hash], previous) => {
      document.title = `${page()?.title ?? 'Page not found'} · Fern Docs`;
      setMenuOpen(false);

      const frame = requestAnimationFrame(() => {
        // Initial fragments may arrive before the client has rendered the page.
        if (!previous && hash) {
          document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
        }

        if (hash === '#main' || (previous && path !== previous[0])) {
          main?.focus({ preventScroll: true });
        }
      });

      return () => cancelAnimationFrame(frame);
    },
  );

  function navigation() {
    return (
      <For each={pageGroups}>
        {(group) => (
          <div class="[&+&]:mt-8 docs-mobile:[&+&]:mt-5">
            <p class="text-[0.75rem] font-semibold text-muted mx-3 mb-3">{group}</p>
            <For each={pages.filter((item) => item.group === group)}>
              {(item) => (
                <a
                  class="
                    block py-[0.4375rem] px-3 my-0.5 rounded-base
                    text-[0.875rem] text-content hover:bg-docs-hover
                    hover:no-underline aria-[current=page]:bg-docs-selected
                    aria-[current=page]:text-action aria-[current=page]:font-[550]
                  "
                  href={item.path}
                  aria-current={page()?.path === item.path ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
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

  return (
    <div class="fern fern-docs min-h-screen" data-theme={props.theme}>
      <a
        class="
          fixed top-[-6.25rem] left-4 z-20 px-4 py-2 bg-canvas
          border border-docs-control focus:top-2
        "
        href={`${current.pathname}#main`}
      >
        Skip to content
      </a>
      <header
        class="
          sticky top-0 z-10 h-18 flex items-center @container
          justify-between px-8 border-b border-line bg-canvas
          docs-mobile:h-16 docs-mobile:px-5
        "
      >
        <a
          class="
            text-[1.125rem] font-[650] tracking-[-0.03em] text-content
            hover:no-underline docs-mobile:text-[1.0625rem]
          "
          href="/foundations/colors"
        >
          Fern{' '}
          <span
            class="
              pl-3 ml-3 border-l border-line text-[0.8125rem] font-normal
              tracking-normal text-muted docs-mobile:hidden
            "
          >
            Docs
          </span>
        </a>
        <div class="flex gap-3 items-center">
          <fieldset
            class="
              theme-switch flex gap-0.5 m-0 p-0 border-0 min-w-0
              rounded-base
            "
            aria-label="Theme"
          >
            <For each={['light', 'dark'] as const}>
              {(value) => (
                <button
                  class="
                    flex items-center justify-center gap-1.5 border-0
                    rounded-[0.125rem] py-1.5 px-2.5 text-muted bg-transparent
                    text-[0.75rem] font-medium
                    aria-pressed:text-content aria-pressed:bg-docs-neutral
                    hover:text-content docs-mobile:px-2
                  "
                  type="button"
                  aria-label={value === 'light' ? 'Light' : 'Dark'}
                  aria-pressed={props.theme === value ? 'true' : 'false'}
                  onClick={() => props.onThemeChange(value)}
                >
                  <Icon icon={value === 'light' ? cdxIconLightbulb : cdxIconMoon} class="size-4" />
                  <span class="@max-[20rem]:hidden">{value === 'light' ? 'Light' : 'Dark'}</span>
                </button>
              )}
            </For>
          </fieldset>
          <button
            class="
              menu-toggle hidden size-9 items-center justify-center
              text-content border border-line rounded-base bg-canvas
              docs-mobile:inline-flex
            "
            type="button"
            aria-label={menuOpen() ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen() ? 'true' : 'false'}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <Icon icon={menuOpen() ? cdxIconClose : cdxIconMenu} />
          </button>
        </div>
      </header>
      <Show when={menuOpen()}>
        <nav
          id="mobile-navigation"
          class="
            mobile-navigation hidden py-6 px-5 border-b border-line
            docs-mobile:block
          "
          aria-label="Mobile navigation"
        >
          {navigation()}
        </nav>
      </Show>
      <div
        class="
          grid grid-cols-[216px_minmax(0,792px)_184px] justify-center
          max-w-[1360px] mx-auto docs-narrow:grid-cols-[200px_minmax(0,792px)]
          docs-mobile:block
        "
      >
        <aside
          class="
            sidebar sticky top-18 h-[calc(100vh-4.5rem)] py-10 px-6
            border-r border-line flex flex-col docs-mobile:hidden
          "
        >
          <nav aria-label="Main navigation">{navigation()}</nav>
        </aside>
        <main
          class="
            flex flex-col min-w-0 min-h-[calc(100dvh-4.5rem)]
            px-12 pt-10 outline-none docs-narrow:px-9
            docs-mobile:min-h-[calc(100dvh-4rem)]
            docs-mobile:px-5 docs-mobile:pt-8
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
              border-t border-line text-muted text-[0.75rem] py-6 mt-16
            "
          >
            Fern · Taxon Labs
          </footer>
        </main>
        <Show when={page()?.sections.length}>
          <aside
            class="
              toc sticky top-18 h-fit py-10 px-6 text-[0.75rem]
              docs-narrow:hidden
            "
          >
            <nav aria-label="On this page">
              <p class="font-semibold mb-3">On this page</p>
              <For each={page()?.sections ?? []}>
                {(title) => (
                  <a
                    class="block text-muted py-1.5 hover:text-action"
                    href={`${current.pathname}#${sectionId(title)}`}
                    aria-current={current.hash === `#${sectionId(title)}` ? 'location' : 'false'}
                  >
                    {title}
                  </a>
                )}
              </For>
            </nav>
          </aside>
        </Show>
      </div>
    </div>
  );
}
