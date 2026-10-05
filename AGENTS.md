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
- Organize Docs pages under `src/docs/pages/foundations/` and `src/docs/pages/components/`. Keep each page's examples in a neighboring `*-examples.tsx` file and tests close to the pages they exercise.
- Use Tailwind utilities without a prefix (`flex`, `gap-2`, `bg-canvas`). Keep Fern component classes and `--fern-*` tokens namespaced. MediaWiki gadgets are intended to use Shadow DOM; the host fixture checks CSS isolation there. ResourceLoader integration remains future work.
- Use Tailwind utilities for Docs layout, spacing, responsiveness, and visual samples. Share repeated presentation in the small helpers in `docs.tsx`. Keep Docs CSS for MDX defaults and structure-dependent rules in layers that utilities can override; split long utility strings across lines. Keep Docs-only token aliases local and reference Codex values.
- MDX holds documentation structure, prose, and static API tables. Keep interactive examples and playground logic in TSX. Do not add automatic page discovery or API generation yet.
- Declare page components, routes, titles, groups, and section titles explicitly in `src/docs/navigation.ts`; the app renders that configuration. Keep section titles consistent with the MDX content. Resolve the MDX provider independently of page folder depth.

## Foundations

| Foundation           | Starting point                                                           |
| -------------------- | ------------------------------------------------------------------------ |
| Colors               | Codex 2.7.0 semantic values; equivalent whitespace formatting is allowed |
| Themes               | Light and Dark, sharing the same prefixed CSS token contract             |
| Headings             | Source Serif 4; 36, 28, and 22px                                         |
| Content and controls | Inter; 16px body, 14px labels                                            |
| Code                 | JetBrains Mono                                                           |
| Spacing              | Tailwind scale with a 4px base; 4, 8, 12, 16, 24, 32, 48px               |
| Radius               | 4px                                                                      |
| Icons                | Wikimedia Codex Icons                                                    |

The Docs app bundles fonts locally with Vietnamese glyphs. Fern provides font stacks; consuming applications load fonts. Wrap components in `.fern` and select a theme with `data-theme="light"` or `data-theme="dark"`. Do not add global Preflight or a global reset to component CSS. Do not mix or adjust upstream colors. Non-color choices remain provisional.

## Conventions

- Use rem for font sizes, spacing, control heights, icon sizes, and radii. Keep border and focus outline dimensions in px, and use unitless line-height where appropriate. Pixel values in the foundations and size descriptions assume a 16px root font size.
- Use Kobalte behavior where appropriate; forward native props, events, refs, and ARIA attributes.
- Button defaults to `type="button"`. Keep links as native anchors, using `buttonVariants()` when appropriate.
- Button sizes are `sm` (24px), `default` (32px), and `lg` (44px), with matching `icon-sm`, `icon`, and `icon-lg` forms. Use 12/14/16px text and 14/16/20px icons in both text and icon-only buttons. Standalone icons default to 16px. Use composition for icons and busy states.
- Button separates visual `variant` (`solid`, `soft`, `surface`, `outline`, `ghost`) from semantic `action` (`neutral`, `progressive`, `destructive`). Defaults are `solid` and `neutral`.
- Use direct namespaced component selectors (`.fern-button`, `.fern-icon`) in `@layer components`, so utilities can override them. Keep `.fern` for theme tokens, fonts, and scoped resets rather than repeating it in component selectors.
- Include the styling group in modifier class names: `fern-button-variant--outline`, `fern-button-action--destructive`, and `fern-button-size--icon`. Keep the base class `fern-button`.
- Docs navigation has Foundations and Components only. Use simple English, no logo or decorative animation.
- Component pages present an introduction, basic example, API Reference, playground, examples, and accessibility notes, in that order.
- In API tables, quote string literal types and defaults with straight double quotes, such as `"default" | "icon"`.
- Use straight apostrophes and quotation marks in authored English text, comments, and code examples. Keep Vietnamese characters intact.
- Format authored code, including HTML and embedded CSS, with Biome and Markdown/MDX with Prettier only. Keep HTML nested with two-space indentation, separate block elements onto their own lines, and indent `<style>` and `<script>` contents.
- Use blank lines between logical steps, declarations and execution, helper functions, and test cases. Separate setup, actions, and assertions where useful. Expand complex configuration and generated code examples onto multiple lines; avoid dense one-line blocks. Keep related short statements together, without adding a blank line after every statement.
- Keep a blank line between CSS rules, including inside media queries. In longer rules, separate logical declaration groups with blank lines, while preserving declaration order. Keep short rules compact and put each declaration on its own line. Separate generated token groups in the generator.
- Generated `tokens.css` and `colors.json` come from the token script. Change the generator rather than editing its output.
- Keep licensing information in root `LICENSE` and `THIRD_PARTY_NOTICES.md`. Do not add copied dependency licenses or license-generation scripts unless explicitly requested.
- Use CVA (`class-variance-authority`) for component variant classes. Keep semantic CSS classes and public styling APIs explicit; do not add Tailwind class merging without a concrete need.
- Keep API changes in `CHANGELOG.md`.

## Git commits

- Use Conventional Commits in English: `<type>(<optional scope>): <description>`.
- Use a lowercase type, such as `feat`, `fix`, `docs`, `refactor`, `test`, `build`, or `chore`.
- Keep the subject concise, preferably within 72 characters, without a trailing period.
- Separate the optional body from the subject with a blank line. Explain the reason for the change when useful.
- Hard-wrap body paragraphs at 72 characters. Do not wrap URLs or machine-readable trailers.
- Mark breaking public API changes with `!` or a `BREAKING CHANGE:` footer.
- Group related changes into a commit. Do not commit unrelated user changes.

## Verification

Run `pnpm install --frozen-lockfile`, then `pnpm dev` from the root.

Docs uses `http://127.0.0.1:4321/`. Keep the port and host in its Vite configuration, with `strictPort` enabled.

Before finishing relevant changes, run `pnpm check`, `pnpm typecheck`, `pnpm test`, and `pnpm build`. Run `pnpm pack:check` when changing exports, dependencies, build output, or styles. The package check uses npm network access and a temporary directory.

For visual or interaction changes, check Light and Dark, narrow screens, and keyboard behavior. Give icon-only controls accessible names. Test reactive props and ensure ordinary buttons do not submit forms.

When changing shared CSS, themes, or embedding behavior, use `/checks/mediawiki.html` during development to verify that host controls retain their styling. Keep the fixture and its instructions in the Docs README; do not accumulate historical verification reports or screenshots in the repository.

Keep prerelease compatibility explicit. A successful Docs build does not prove a tarball works elsewhere. Do not claim SSR, ResourceLoader integration, or stable release support before verifying them.

## Later

Additional themes, ResourceLoader integration, automatic skin theme detection, and components beyond Kobalte remain future work. Add components after reviewing Button.

## References

- [Codex colors](https://doc.wikimedia.org/codex/latest/style-guide/colors.html)
- [Kobalte](https://kobalte.dev/)
- [MDX](https://mdxjs.com/)
