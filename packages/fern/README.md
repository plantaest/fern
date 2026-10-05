# Fern

Reusable Solid components and Codex-based themes. This is an unpublished alpha package; its npm scope is provisional.

## Usage

```tsx
import { Button } from '@taxon-labs/fern/button';
import '@taxon-labs/fern/styles.css';

<div class="fern" data-theme="light">
  <Button variant="outline" action="progressive">
    Save changes
  </Button>
</div>;
```

Switch the container to `data-theme="dark"` for Dark. Both themes expose the same `--fern-*` variables. Values come from Codex 2.7.0; function spacing is normalized. Keep the container around components, including future portal destinations.

Component selectors use their names directly, such as `.fern-button` and `.fern-icon`, in the `components` layer. Tailwind utilities in the later `utilities` layer can override their styling. The `.fern` container provides theme tokens, fonts, and a scoped box-sizing reset; it is still required for the default theme setup.

CSS is already compiled: consumers do not need Tailwind to render components. There is no global Preflight. Fern declares Inter, Source Serif 4, and JetBrains Mono stacks but does not download or bundle fonts. Applications can load fonts or override `--fern-font-content`, `--fern-font-heading`, and `--fern-font-code` on the container.

## Public exports

| Entry           | Contents                                                                          |
| --------------- | --------------------------------------------------------------------------------- |
| Package root    | Button, Icon, their types, and `buttonVariants`                                   |
| `/button`       | Button, `buttonVariants`, and Button types                                        |
| `/icon`         | Decorative Codex icon helper and its props                                        |
| `/styles.css`   | Compiled component CSS and both themes                                            |
| `/tokens.css`   | Both themes without component styling                                             |
| `/colors.json`  | Values keyed by theme and Codex role                                              |
| `/tailwind.css` | Optional Tailwind 4 theme adapter for applications generating their own utilities |

The Tailwind adapter uses standard utility names without a prefix, such as `flex`, `gap-2`, and `bg-canvas`. Fern component classes and theme tokens retain their `fern-` and `--fern-` names. For a MediaWiki gadget using Shadow DOM, load the compiled Fern CSS inside the shadow root and keep the `.fern` theme container around components and portal destinations.

Within `.fern`, Button gaps and padding share `--fern-spacing` (0.25rem) with Tailwind's numeric spacing and sizing utilities. The adapter also maps `font-sans`, `font-serif`, `font-mono`, and `rounded-base` to Fern's font and radius tokens. Override these tokens on the container to keep components and utilities in sync. Font sizes, spacing, control heights, icons, and radii use rem; borders and focus outlines use px. Sizes shown in pixels assume a 16px root font size. Rem sizes follow the document's root font size, including inside Shadow DOM.

Import individual icons from `@wikimedia/codex-icons`. Put accessible names on the surrounding controls. `buttonVariants()` applies appearance to native links without changing semantics.

Button separates `variant` (`solid`, `soft`, `surface`, `outline`, `ghost`) from `action` (`neutral`, `progressive`, `destructive`). Defaults are `solid` and `neutral`. Set `action="progressive"` for actions that move a task forward. Sizes are `sm` (24px), `default` (32px), and `lg` (44px), with matching `icon-sm`, `icon`, and `icon-lg` squares. `ButtonVariant`, `ButtonAction`, and `ButtonSize` are exported from the package root and `/button`.

The `solid` export condition preserves JSX for the consuming compiler. Default ESM is compiled for browser rendering. Type declarations ship with the package. Solid runtimes are peer dependencies; CSS is marked as having side effects. SSR/hydration is not verified.

## Compatibility and license

The tested runtime is Solid and `@solidjs/web` `2.0.0-rc.13`, with Kobalte `2.0.0-alpha.2`. Kobalte's peers target an earlier RC; see the root README for the release limitation.

License: `GPL-2.0-or-later`.
