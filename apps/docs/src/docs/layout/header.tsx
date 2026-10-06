import { Icon } from '@taxon-labs/fern/icon';
import { cdxIconClose, cdxIconLightbulb, cdxIconMenu, cdxIconMoon } from '@wikimedia/codex-icons';
import { For } from 'solid-js';
import type { Theme } from '../theme';

export function Header(props: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  return (
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
                  rounded-base py-1.5 px-2.5 text-muted bg-transparent
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
          aria-label={props.menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={props.menuOpen ? 'true' : 'false'}
          aria-controls="mobile-navigation"
          onClick={props.onMenuToggle}
        >
          <Icon icon={props.menuOpen ? cdxIconClose : cdxIconMenu} />
        </button>
      </div>
    </header>
  );
}
