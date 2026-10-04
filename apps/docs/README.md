# Fern Docs

Private documentation and playground for the current alpha. Use it to explore designs now; it is intended to become Fern's official documentation. Run commands from the repository root; see [the root README](../../README.md).

`src/docs/pages/foundations/` and `src/docs/pages/components/` hold the MDX documents. Each page keeps its visual samples and interactions in a neighboring `*-examples.tsx` file; tests stay alongside the relevant pages. MDX holds static content, including API tables.

`src/docs/navigation.ts` explicitly declares each page component, route, title, group, and table of contents. Add new pages there; Solid Router renders the configured component. Keep section titles in the configuration consistent with the MDX document.

The small MDX provider maps Markdown tags to Solid elements. Its import path is resolved from the Vite configuration, independently of page folder depth.

Code examples use single quotes for JavaScript and TypeScript strings, including expressions inside JSX. Use double quotes for JSX attribute values.

The Docs app imports Fern through public package exports. It bundles its own fonts, owns global page layout, and generates its own Tailwind utilities without a prefix. Fern component CSS works independently of that utility generation.

Use Tailwind utilities in TSX for layout, spacing, responsive behavior, and visual examples. The small helpers in `docs.tsx` share preview, frame, field, code, and reading-sample styling. Controls inside `Field` remain native HTML; connect their `id` to the field's `for` prop and use `fieldControlClasses`.

`styles.css` keeps MDX element defaults in the `base` layer and document structure rules in `components`, so utilities can override them. Docs color aliases reference Fern's Codex tokens. The `docs-narrow`, `docs-mobile`, and `docs-tiny` variants preserve the existing 1150px, 760px, and 360px boundaries. Keep class strings literal so Tailwind can discover them, and split long strings across lines for readability.

Fern component styles live in the `components` layer. Use normal utilities to resize or hide an Icon; no important modifier is needed for those overrides.

Add a component and its MDX page after reviewing the previous component. Keep API Reference above playground and examples. Do not add automatic API generation yet.

Development and preview use `http://127.0.0.1:4321/`, configured in `vite.config.ts`. A busy port causes an error instead of silently selecting another port.

Docs uses `@solidjs/router` `2.0.0-next.35` with Solid 2 RC.13. Routes use browser history, such as `/components/button`, with ordinary fragments for sections, such as `#accessibility`. The home URL redirects to `/foundations/colors`. Theme changes and section links keep the current page mounted.

Vite development and preview serve `index.html` for direct page URLs. When deploying the Docs SPA, configure the host to serve `index.html` for page routes while serving assets normally. Verify direct URLs and reloads on that host; production hosting and SSR are not yet verified.

## Shadow DOM embedding check

With `pnpm dev` running, open `http://127.0.0.1:4321/checks/mediawiki.html`. The HTML host has its own button, input, and link styles; `src/checks/mediawiki.tsx` renders Fern in an open shadow root with the compiled package CSS loaded inside it.

Check the fixture in both Light and Dark:

- Fern text and buttons use the package font stacks and theme colors instead of the host's Georgia font and custom colors. The fixture does not load font files; consuming applications provide them.
- Use Tab and Shift+Tab to move through the host controls and Fern buttons. Each focused Fern button has a visible focus indicator.
- Activate "Switch theme" with Enter and Space. The Fern theme changes and focus stays on the button.
- Host controls retain their font, colors, background, and borders when the Fern theme changes.

Recheck when changing shared CSS, themes, or embedding behavior.

This fixture checks that Fern's compiled CSS, theme tokens, scoped styles, and keyboard behavior work inside a shadow root on an independently styled host. It does not verify integration with a production MediaWiki skin or ResourceLoader. Keep the fixture small. Do not store historical verification reports or screenshots in this directory.
