# Changelog

## 0.1.0-alpha.0 (unreleased)

- Breaking: remove `buttonVariantNames`, `buttonActionNames`, and `buttonSizeNames` from public exports. Keep option lists in Docs and tests.
- Breaking: rename `--fern-radius` to `--fern-radius-base` and the Tailwind utility `rounded-fern` to `rounded-base`. Keep the radius at 0.25rem.
- Add the Button `soft` variant after `solid`. Use Codex subtle backgrounds and action text colors without a visible border, including hover and active states.
- Use rem for font sizes, spacing, Button heights, Icon sizes, and radii. Keep borders and focus outlines in px; default dimensions are unchanged at a 16px root font size. Update Docs typography and controls to scale together.
- Add `--fern-spacing` (0.25rem) for Button gaps and padding. Map Tailwind spacing, font families, and `rounded-base` to the same Fern tokens.
- Transition Button background, text, and border colors over 100ms with ease. Keep pressed states immediate and disable transitions for reduced motion.
- Prevent decorative icons from receiving focus and showing their own outline inside buttons or links.
- Set the default Icon size to 16px and update the Docs gallery.
- Add Button sizes `sm` (24px) and `lg` (44px), with `icon-sm` and `icon-lg`. Keep the default at 32px; use 12/14/16px text and 14/16/20px icons in both text and icon-only buttons, including icons inside wrappers. Add size controls and examples to Docs.
- Use the default cursor for Buttons and Docs buttons.
- Breaking: remove the Button `link` variant. Use `ghost` for low-emphasis actions and native anchors for navigation. Keep `buttonVariants()` for anchors that need button styling.
- Use Codex neutral text colors for `surface`, `outline`, and `ghost` Buttons across enabled states.
- Breaking: separate Button appearance (`solid`, `surface`, `outline`, `ghost`) from semantic action (`neutral`, `progressive`, `destructive`). Defaults are `solid` and `neutral`. Replace `variant="default"` with `variant="solid" action="progressive"`, `variant="destructive"` with `action="destructive"`, and `variant="secondary"` with `variant="solid"`. Set `action="progressive"` explicitly for main actions.
- Add `ButtonAction` to the public exports and action selection to the Docs playground.
- Reduce Button and icon-only dimensions to 32px. Update outline hover/active borders and remove visible disabled borders while preserving the outside focus indicator.
- Separate Fern into a reusable package and the private Docs app into `apps/docs`.
- Export Button, Icon, declarations, compiled scoped CSS, tokens, color data, and a Tailwind adapter.
- Move Docs page structure to MDX, with interactions in TSX.
- Add shared formatting, linting, and clean tarball verification.
- Preserve Codex colors while normalizing function spacing.
- Rename the exploration application to Fern Docs in `apps/docs`, using port 4321.
- Quote string literals in API tables and document Conventional Commits with 72-character body wrapping.
- Keep only the root license and a short third-party notice; remove copied dependency licenses and related build code.
- Export `buttonVariants` directly from CVA and derive variant types from its recipe. Keep Button style props strict.
- Name Button modifier classes by group: `fern-button-variant--*` and `fern-button-size--icon`.
- Remove the Tailwind utility prefix from the adapter, package styles, and Docs. Keep Fern component classes and token names unchanged.
- Use direct component selectors in the `components` layer, allowing utility overrides without important modifiers. Keep the Fern theme container and scoped reset. Check MediaWiki host isolation with a Shadow DOM fixture.
- Use Solid Router 2 in Docs with pathname URLs and section fragments. Keep the router separate from the Fern package.
- Use the operating system's temporary directory and invoke pnpm through Node for clean package checks.
- Add GitHub Actions checks that can run manually during early development.
- Confirm GPL-2.0-or-later as Fern's license.

Solid and Kobalte remain prerelease dependencies. npm publication is pending compatibility and package scope confirmation.
