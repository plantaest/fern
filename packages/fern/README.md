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

Use `<Button as="a" href="/article">` for navigation, or `as={Link}` with an anchor-rendering router component. Use `buttonVariants()` to style a native anchor directly.

Import icons from `@wikimedia/codex-icons` and render them with `Icon`. Icons are decorative; give the surrounding control an accessible name.

## Public exports

| Entry           | Contents                                        |
| --------------- | ----------------------------------------------- |
| Package root    | Button, Icon, their types, and `buttonVariants` |
| `/button`       | Button, `buttonVariants`, and Button types      |
| `/icon`         | Icon and its props                              |
| `/styles.css`   | Themes, shared setup, and component CSS         |
| `/tokens.css`   | Color tokens for Light and Dark only            |
| `/colors.json`  | Color values keyed by theme and token name      |
| `/tailwind.css` | Optional Tailwind 4 theme adapter               |

## Styling

Keep components inside `.fern` and select `data-theme="light"` or `data-theme="dark"`. Both themes share the same `--fern-*` contract and preserve Codex 2.7.0 color values and semantic roles. Numbered color tokens use names such as `--fern-color-red-300`.

`/styles.css` is compiled and works without Tailwind. It provides theme tokens, fonts, a scoped box-sizing reset, and component styles. `/tokens.css` contains colors only; it does not include typography, spacing, radius, or font setup. Fern does not include global Preflight.

Applications load fonts. Fern declares Inter, Source Serif 4, and JetBrains Mono stacks; override `--fern-font-content`, `--fern-font-heading`, and `--fern-font-code` on `.fern` to use other fonts. Public tokens can also customize spacing, radius, typography, and transitions.

Font sizes, spacing, control heights, icons, and radii use rem; borders and focus outlines use px. Pixel descriptions assume a 16px document root font size. Rem follows that root size even inside Shadow DOM.

For MediaWiki embedding, load `/styles.css` inside the shadow root and place the `.fern` container around components and any portal destinations.

## Tailwind

Keep the `/styles.css` import from Usage. Add the following to your application stylesheet and process it with Tailwind 4:

```css
@import '@taxon-labs/fern/tailwind.css';
@import 'tailwindcss/utilities.css' layer(utilities);
```

The adapter maps Fern tokens to utilities such as `bg-canvas`, `text-body`, and `rounded-base`, and shares `--fern-spacing` with numeric spacing utilities. Tailwind generates the utilities, including standard classes such as `flex` and `gap-2`.

Component styles are in the `components` layer; utilities in the later `utilities` layer can override them. Fern classes and tokens remain namespaced, while utilities use standard names without a prefix.

## Compatibility and license

The tested runtime is Solid and `@solidjs/web` `2.0.0-rc.13`, with Kobalte `2.0.0-alpha.2`. Kobalte's utils package declares older Solid peers. Resolve that mismatch before claiming strict-install or stable release support. SSR/hydration is not verified.

Run `pnpm release:check` from the repository root to check the packed package with strict peer resolution. It is currently expected to fail on Kobalte peer metadata.

Repository tooling requires Node 22.12 or newer. Codex's own tooling declares a newer Node requirement; Fern reads its prebuilt color and icon data, tested on Node 22.19.0.

License: `GPL-2.0-or-later`.
