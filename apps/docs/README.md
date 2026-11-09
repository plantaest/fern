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

Markdown links to external websites open in a new tab and show an external link icon. Internal links and section fragments stay in the current tab.

`CodeBlock` highlights TSX, CSS, and HTML with a shared, lazy-loaded Shiki instance. GitHub Light/Dark Default syntax colors follow the Docs theme while the background stays in Fern's palette; muted syntax in Light uses Fern's subtle text color for contrast. Other languages remain plain text. Copy always uses the original source, including in reactive playgrounds.

## Styling

Docs consumes Fern through public package exports, bundles its own fonts, and owns global page layout. Use Tailwind utilities for layout and visual samples, and helpers in `src/docs/ui.tsx` for previews, frames, fields, and code. For native playground controls, match the control's `id` to `Field`'s `for` prop and use `fieldControlClasses`.

The page body uses `.fern-prose` from the package for document typography and spacing. Preview helpers use `.fern-not-prose` to keep embedded UI independent. `src/docs/styles.css` owns shell defaults, code controls, API tables, and heading scroll offsets, allowing utility overrides. The package's Tailwind adapter maps Fern tokens to utilities without a prefix.

## Development

Development and preview use `http://127.0.0.1:4321/`. A busy port causes an error rather than selecting another port. Docs uses pathname routes such as `/components/button` and fragments such as `#accessibility`; the home URL redirects to `/foundations/colors`.

## Deployment

Build and run the static production app from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm build
PORT=8000 pnpm --filter fern-docs start
```

`serve` reads `PORT` and serves `apps/docs/dist` with SPA fallback. Check direct URLs and reloads at `/components/button` and `/foundations/colors`, and verify that CSS, fonts, and syntax-highlighting chunks load.

For [Toolforge Build Service](https://wikitech.wikimedia.org/wiki/Help:Toolforge/Build_service), the root `Procfile` starts Docs after the buildpack installs dependencies and runs the root build script. After committing and pushing the changes, run these commands on Toolforge as the `fern` tool:

```sh
toolforge build start https://github.com/plantaest/fern.git
toolforge build show
```

Once the build reports `ok(Succeeded)`, start the webservice:

```sh
toolforge webservice buildservice start --mount=none
```

Verify direct routes and reloads at `https://fern.toolforge.org/`. On Toolforge, save `type: buildservice` and `mount: none` in `~/service.template`. For later deployments, build again, wait for success, and run `toolforge webservice restart`. Inspect runtime logs with `toolforge webservice buildservice logs -f`.

Toolforge hosting and SSR remain unverified until checked in their respective environments.
