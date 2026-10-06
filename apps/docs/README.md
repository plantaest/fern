# Fern Docs

Private documentation and playground for the current alpha, intended to become Fern's official documentation. Run commands from the repository root; see the [root README](../../README.md) and [shared conventions](../../AGENTS.md).

`src/docs/app.tsx` assembles routes and pages. The app shell lives in `src/docs/layout/`, theme persistence in `theme.ts`, and page metadata in `navigation.ts`.

## Pages and examples

Pages live in `src/docs/pages/foundations/` and `src/docs/pages/components/`. Each MDX page has a neighboring `*-examples.tsx` file for samples, playgrounds, and demo imports, with standalone sources in `*-demos/`. Keep tests close to the pages they exercise.

Use YAML frontmatter for `title` and `description`, Markdown headings and paragraphs for structure, and static API tables in MDX. The app renders the intro and wraps the body in `.fern-docs-content`. Register the page in `src/docs/navigation.ts`, importing its frontmatter and declaring the route, group, and section titles. Heading IDs are generated; keep table-of-contents titles consistent with the document.

For an interactive example:

1. Write a standalone TSX component in the page's `*-demos/` directory.
2. Import it normally and with Vite `?raw` in `*-examples.tsx`; export a `{ component, source }` pair.
3. Render it in MDX with `<Example demo={buttonVariantsExample} />`, placing headings and descriptions outside the frame.

The preview and Copy control use the same demo file. Playground logic stays in TSX, with source generated from the selected props.

Write static code in fenced Markdown blocks. They render through `CodeBlock` with a language label and Copy control; unlabeled blocks use `TEXT`. Inline code stays inline. Build-time MDX plugins live in `plugins/`.

## Styling

Docs consumes Fern through public package exports, bundles its own fonts, and owns global page layout. Use Tailwind utilities for layout and visual samples, and helpers in `src/docs/ui.tsx` for previews, frames, fields, and code. For native playground controls, match the control's `id` to `Field`'s `for` prop and use `fieldControlClasses`.

The page body uses `.fern-prose` from the package for document typography and spacing. Preview helpers use `.fern-not-prose` to keep embedded UI independent. `src/docs/styles.css` owns shell defaults, code controls, API tables, and heading scroll offsets, allowing utility overrides. The package's Tailwind adapter maps Fern tokens to utilities without a prefix.

## Development

Development and preview use `http://127.0.0.1:4321/`. A busy port causes an error rather than selecting another port. Docs uses pathname routes such as `/components/button` and fragments such as `#accessibility`; the home URL redirects to `/foundations/colors`.

For deployment, configure the host to serve `index.html` for page routes while serving assets normally. Verify direct URLs and reloads on that host. Production hosting and SSR are not yet verified.

## Shadow DOM embedding check

With `pnpm dev` running, open `http://127.0.0.1:4321/checks/mediawiki.html`. The HTML host has its own button, input, and link styles; `src/checks/mediawiki.tsx` renders Fern in an open shadow root with the compiled package CSS loaded inside it.

Check the fixture in both Light and Dark:

- Fern text, buttons, and prose use the package font stacks and theme colors instead of the host's custom styles. Check the serif heading, paragraph, inline code, list, and link. The fixture does not load font files; consuming applications provide them.
- Use Tab and Shift+Tab to move through the host controls and Fern buttons. Each focused Fern button has a visible focus indicator.
- Activate "Switch theme" with Enter and Space. The Fern theme changes and focus stays on the button.
- Host controls retain their font, colors, background, and borders when the Fern theme changes.

Recheck when changing shared CSS, themes, or embedding behavior.

The fixture does not verify integration with a production MediaWiki skin or ResourceLoader.
