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
        justify-between px-8 border-b border-line-subtle bg-surface-base
        screen-small:h-16 screen-small:px-5
      "
    >
      <a
        class="
          text-lg leading-md font-semibold text-content-base no-underline
        "
        href="/foundations/colors"
      >
        Fern{' '}
        <span
          class="
            pl-3 ml-3 border-l border-line-subtle text-small-xs font-normal
            text-content-subtle screen-small:hidden
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
                  rounded-base py-1.5 px-2.5 text-content-subtle bg-transparent
                  text-small-2xs font-medium
                  aria-pressed:text-content-base aria-pressed:bg-surface-neutral
                  hover:text-content-base screen-small:px-2
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
            text-content-base border border-line-subtle rounded-base bg-surface-base
            screen-small:inline-flex
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
