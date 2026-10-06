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

`/styles.css` is built from standard CSS without the Tailwind compiler and works without Tailwind. It provides theme tokens, font setup, prose, a scoped box-sizing reset, and component styles. `/tokens.css` contains colors only. Fern does not include global Preflight.

Applications load fonts. Fern declares Inter, Source Serif 4, and JetBrains Mono stacks; override `--fern-font-sans`, `--fern-font-serif`, and `--fern-font-mono` on `.fern` to use other fonts. Public tokens can also customize spacing, radius, typography, and transitions.

Typography uses independent `--fern-font-size-*`, `--fern-font-weight-*`, and `--fern-line-height-*` scales. Prose and components combine them into text styles. Size tokens range from `xx-small` (12px) to `xxx-large` (36px); body uses the unitless `--fern-line-height-normal` (1.625), while fixed leading tokens use rem.

Font weights are `normal` (400), `medium` (500), `semibold` (600), and `bold` (700).

Use `fern-prose` inside `.fern` to format document HTML. It styles headings, paragraphs, links, lists, quotes, code, tables, and figures without setting the content width. Add `fern-not-prose` to embedded UI to exclude its elements from prose styles. Both classes are included in `/styles.css`.

Set `--fern-prose-flow` on a prose container to adjust block spacing without changing text sizes or line heights. It defaults to four spacing units (16px); heading, list item, and caption gaps follow its proportions.

Font sizes, spacing, control heights, icons, and radii use rem; borders and focus outlines use px. Pixel descriptions assume a 16px document root font size. Rem follows that root size even inside Shadow DOM.

For MediaWiki embedding, load `/styles.css` inside the shadow root and place the `.fern` container around components and any portal destinations.

## Tailwind

Keep the `/styles.css` import from Usage. Add the following to your application stylesheet and process it with Tailwind 4:

```css
@import '@taxon-labs/fern/tailwind.css';
@import 'tailwindcss/utilities.css' layer(utilities);
```

The adapter maps Fern tokens to utilities such as `bg-surface-base`, `text-body`, and `rounded-base`, and shares `--fern-spacing` with numeric spacing utilities. Tailwind generates the utilities, including standard classes such as `flex` and `gap-2`.

Color aliases in `@theme` use `content-*`, `surface-*`, and `line-*` to preserve Codex roles. Choose the role that matches the CSS property. Use `bg-surface-base`, `bg-surface-neutral-subtle`, and `bg-surface-neutral` for backgrounds; `text-content-base`, `text-content-subtle`, and `placeholder:text-content-placeholder` for text; and `border-line-base` or `border-line-subtle` for borders. `text-base` remains a font-size utility.

Progressive roles include `text-content-progressive`, `bg-surface-progressive`, and `border-line-progressive`. Combine state aliases with variants, such as `hover:text-content-progressive-hover` and `focus-visible:outline-line-progressive-focus`.

Font-size utilities use Fern's scale and set size only:

| Utility     | Size token  | Size |
| ----------- | ----------- | ---- |
| `text-2xs`  | `xx-small`  | 12px |
| `text-xs`   | `x-small`   | 13px |
| `text-sm`   | `small`     | 14px |
| `text-base` | `medium`    | 16px |
| `text-lg`   | `large`     | 18px |
| `text-xl`   | `x-large`   | 22px |
| `text-2xl`  | `xx-large`  | 28px |
| `text-3xl`  | `xxx-large` | 36px |

`leading-sm`, `leading-md`, `leading-lg`, `leading-xl`, and `leading-2xl` map to 20, 24, 28, 36, and 44px. `leading-normal` maps to the unitless 1.625. These replace Tailwind's default text and named leading scales.

Combine basic utilities for UI text, such as `text-sm leading-sm font-medium`, or code, such as `font-mono text-xs leading-sm`. The `text-body` (16px / 1.625), `text-small` (14px / 20px), `text-small-xs` (13px / 20px), `text-small-2xs` (12px / 20px), and `text-heading-1` through `text-heading-6` presets combine size and leading; family and weight remain separate.

Component styles are in the `components` layer; utilities in the later `utilities` layer can override them. Fern classes and tokens remain namespaced, while utilities use standard names without a prefix.

## Compatibility and license

The tested runtime is Solid and `@solidjs/web` `2.0.0-rc.13`, with Kobalte `2.0.0-alpha.2`. Kobalte's utils package declares older Solid peers. Resolve that mismatch before claiming strict-install or stable release support. SSR/hydration is not verified.

Run `pnpm release:check` from the repository root to check the packed package with strict peer resolution. It is currently expected to fail on Kobalte peer metadata.

Repository tooling requires Node 22.12 or newer. Codex's own tooling declares a newer Node requirement; Fern reads its prebuilt color and icon data, tested on Node 22.19.0.

License: `GPL-2.0-or-later`.
