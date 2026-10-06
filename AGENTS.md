# Fern Design System

Fern is a design system for software built by Taxon Labs for Vietnamese Wikipedia and the Wikimedia movement. It is Wikimedia-first, functional, restrained, and accessible. It supports tools, dashboards, editors, workspaces, and AI applications.

## Principles

- Start with useful behavior and clear content.
- Preserve Codex color values and semantic roles, including interaction states.
- Keep code and interfaces small enough to review together.
- Add one component at a time. Keyboard interaction and accessible names are part of its design.
- Keep reusable components independent of Docs. Namespace component classes and limit resets to the Fern container.

## Layout and stack

- `packages/fern`: reusable package, public exports, foundations, components, token generator, and component tests.
- `apps/docs`: private Docs application, currently used to explore foundations and components and intended to become the official documentation. Consume Fern through package exports, without source aliases.
- `scripts/check-package.mjs`: verify a packed tarball in a clean application without workspace overrides or Tailwind.
- Use pnpm from the repository root, with one workspace lockfile.
- Use TypeScript, SolidJS 2, Tailwind CSS 4, and Kobalte. Solid 2 RC and Kobalte alpha are deliberate choices; do not silently switch to Solid 1.
- Organize Docs pages under `src/docs/pages/foundations/` and `src/docs/pages/components/`. Keep each page's samples, playground, and explicit demo imports in a neighboring `*-examples.tsx` file, with standalone demo sources in its `*-demos/` directory and tests close to the pages they exercise.
- Use Tailwind utilities without a prefix (`flex`, `gap-2`, `bg-surface-base`). Keep Fern component classes and `--fern-*` tokens namespaced. MediaWiki gadgets are intended to use Shadow DOM; the host fixture checks CSS isolation there. ResourceLoader integration remains future work.

## Foundations

| Foundation           | Starting point                                                           |
| -------------------- | ------------------------------------------------------------------------ |
| Colors               | Codex 2.7.0 semantic values; equivalent whitespace formatting is allowed |
| Themes               | Light and Dark, sharing the same prefixed CSS token contract             |
| Headings             | Source Serif 4 for H1/H2; Inter for H3–H6; sizes and leading follow Docs |
| Content and controls | Inter; 16px body, 14px labels                                            |
| Code                 | JetBrains Mono                                                           |
| Spacing              | Tailwind scale with a 4px base; 4, 8, 12, 16, 24, 32, 48px               |
| Radius               | 4px                                                                      |
| Icons                | Wikimedia Codex Icons                                                    |

The Docs app bundles fonts locally with Vietnamese glyphs. Fern provides font stacks; consuming applications load fonts. Wrap components in `.fern` and select a theme with `data-theme="light"` or `data-theme="dark"`. Do not add global Preflight or a global reset to component CSS. Do not mix or adjust upstream colors. Non-color choices remain provisional.

## Package conventions

- Use rem for font sizes, spacing, control heights, icon sizes, and radii. Keep border and focus outline dimensions in px, and use unitless line-height where appropriate. Pixel values in the foundations and size descriptions assume a 16px root font size.
- Use Kobalte behavior where appropriate; forward native props, events, refs, and ARIA attributes.
- Button defaults to `type="button"` and supports Kobalte's polymorphic `as` prop with inferred element or component props. Render navigation as native anchors through `as="a"`, an anchor-rendering router component, or `buttonVariants()`.
- Keep the default Button at 32px with 14px text and 16px icons. Text and icon-only buttons share an icon size at each size preset; standalone icons default to 16px. Keep presets consistent with the Button Docs. Use composition for icons and busy states.
- Button separates visual `variant` from semantic `action`, defaulting to `solid` and `neutral`.
- Use direct namespaced component selectors (`.fern-button`, `.fern-icon`) in the `components` layer, assigned by `@import "..." layer(components)` in `styles.css`, so utilities can override them. Keep component CSS free of layer wrappers. Keep `.fern` for theme tokens, fonts, and scoped resets rather than repeating it in component selectors.
- Keep core CSS independent of the Tailwind compiler. Use standard CSS such as `calc(var(--fern-spacing) * 2)`; Tailwind belongs to Docs and the optional adapter.
- Keep each component's TSX, CSS, and tests together in its own directory under `packages/fern/src/components/`. Keep shared `.fern` setup in `foundations/base.css`; `styles.css` declares layer order and imports the foundations and component styles.
- Use `.fern-prose` for document HTML and `.fern-not-prose` for embedded UI. Derive document block spacing from `--fern-prose-flow`. Keep document styles in `foundations/prose.css`, with low specificity and no content width or page layout. Font family tokens are `--fern-font-sans`, `--fern-font-serif`, and `--fern-font-mono`.
- Keep font size, weight, and line-height tokens independent of heading levels and components. Prose, components, and Tailwind text presets combine the shared scales. Body leading stays unitless; fixed leading values use rem.
- Tailwind color aliases use `content-*`, `surface-*`, and `line-*` in `@theme`; choose the matching role for each CSS property (`text-content-progressive`, `bg-surface-progressive`, `border-line-progressive`). Use `text-content-base` for base text color; `text-base` remains a font-size utility.
- Tailwind size utilities use Fern's scale, from `text-xs` to `text-3xl`, and set size only. Combine them with `leading-sm` through `leading-2xl` or `leading-normal`; keep combined presets to `text-body`, `text-small`, `text-extra-small`, and `text-heading-1` through `text-heading-6`.
- Include the styling group in modifier class names: `fern-button-variant--outline`, `fern-button-action--destructive`, and `fern-button-size--icon`. Keep the base class `fern-button`.
- Generated `colors.css` and `colors.json` come from `scripts/colors.mjs`. Change the generator rather than editing its output.
- Numbered color token names separate the shade with a hyphen, such as `color-red-300` and `color-modifier-gray-100-translucent`. Preserve Codex values and semantic role names.
- Keep licensing information in root `LICENSE` and `THIRD_PARTY_NOTICES.md`. Do not add copied dependency licenses or license-generation scripts unless explicitly requested.
- Use CVA (`class-variance-authority`) for component variant classes. Keep semantic CSS classes and public styling APIs explicit; do not add Tailwind class merging without a concrete need.

## Docs conventions

- Docs navigation has Foundations and Components only. Use simple, concise English, no logo or decorative animation.
- MDX holds structure, prose, and static API tables. Use YAML frontmatter for title and description, and Markdown headings and paragraphs for content. Keep interactive examples and playground logic in TSX.
- Declare pages, routes, groups, and section titles explicitly in `src/docs/navigation.ts`, importing titles and descriptions from frontmatter. Keep section titles consistent with MDX. Do not add automatic page discovery or API generation yet.
- Keep build-time MDX plugins in `apps/docs/plugins/`. Resolve the MDX provider independently of page folder depth.
- Use Tailwind utilities for layout, spacing, responsiveness, and visual samples. Share repeated presentation in `ui.tsx`. Keep Docs CSS for MDX defaults and structure-dependent rules in layers that utilities can override. Keep Docs-only token aliases local and reference Codex values.
- Component pages present an introduction, basic example, API Reference, playground, examples, and accessibility notes, in that order.
- In API tables, quote string literal types and defaults with straight double quotes, such as `"default" | "icon"`.

## Formatting

- Use Biome for authored code, including HTML and CSS, and Prettier for Markdown/MDX. Use single quotes for JS/TS strings and double quotes for JSX attribute values.
- Use straight apostrophes and quotation marks in authored English, comments, and examples. Keep Vietnamese characters intact.
- Keep HTML nested with two-space indentation, separate block elements onto their own lines, and indent `<style>` and `<script>` contents.
- Use blank lines between logical steps, declarations and execution, helper functions, and test cases. Separate setup, actions, and assertions where useful. Expand complex configuration and generated examples onto multiple lines. Keep related short statements together.
- Keep blank lines between CSS rules, including inside media queries. In longer rules, separate declaration groups while preserving order. Put each declaration on its own line and separate generated token groups in the generator.
- Split long utility strings across lines and keep classes literal for Tailwind discovery.

## Changelog

- Before the first release, keep the `Unreleased` section in `CHANGELOG.md` as a short summary of the initial alpha. Revise entries as the design changes; omit experimental history and migration notes.
- Omit internal refactors, formatting, wording, and test maintenance unless they affect users.
- On release, add the version and date and start a new `Unreleased` section. Record subsequent changes against the latest release, with categories and migration notes as needed.

## Git commits

- Use Conventional Commits in English: `<type>(<optional scope>): <description>`.
- Use a lowercase type, such as `feat`, `fix`, `docs`, `refactor`, `test`, `build`, or `chore`.
- Keep the subject concise, preferably within 72 characters, without a trailing period.
- Separate the optional body from the subject with a blank line. Explain the reason for the change when useful.
- Hard-wrap body paragraphs at 72 characters. Do not wrap URLs or machine-readable trailers.
- Mark breaking public API changes with `!` or a `BREAKING CHANGE:` footer.
- Group related changes into a commit. Do not commit unrelated user changes.

## Verification

Install dependencies with `pnpm install --frozen-lockfile`. For browser checks, run `pnpm dev` from the root or reuse the existing dev server.

Docs uses `http://127.0.0.1:4321/`. Keep the port and host in its Vite configuration, with `strictPort` enabled.

For changes limited to Markdown documentation, run `pnpm check`; a dev server and runtime checks are unnecessary. For code, configuration, styles, or MDX changes, run `pnpm check`, `pnpm typecheck`, `pnpm test`, and `pnpm build`. Also run `pnpm pack:check` when changing exports, dependencies, build output, or styles. The package check uses npm network access and a temporary directory.

For visual or interaction changes, check Light and Dark, narrow screens, and keyboard behavior. Give icon-only controls accessible names. Test reactive props and ensure ordinary buttons do not submit forms.

When changing shared CSS, themes, or embedding behavior, use `/checks/mediawiki.html` during development to verify that host controls retain their styling. Keep the fixture and its instructions in the Docs README; do not accumulate historical verification reports or screenshots in the repository.

Keep prerelease compatibility explicit. A successful Docs build does not prove a tarball works elsewhere. Do not claim SSR, ResourceLoader integration, or stable release support before verifying them.

## Later

Additional themes, ResourceLoader integration, automatic skin theme detection, and components beyond Kobalte remain future work. Add components after reviewing Button.

## References

- [Codex colors](https://doc.wikimedia.org/codex/latest/style-guide/colors.html)
- [Kobalte](https://kobalte.dev/)
- [MDX](https://mdxjs.com/)
