# Fern

A Wikimedia-first design system for Taxon Labs applications. Fern Docs explores foundations and components and will grow into the official documentation.

See the [package README](packages/fern/README.md) for usage and exports, and [AGENTS.md](AGENTS.md) for development principles and conventions.

## Develop

Use pnpm 8.15.5 and Node 22.12 or newer.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:4321/`. Docs uses Solid Router with pathname URLs, such as `/components/button#accessibility`. The home URL redirects to `/foundations/colors`. `pnpm dev` builds Fern first. After editing package source, restart this command or run `pnpm --filter @taxon-labs/fern build`. Docs TSX and MDX edits use Vite's normal reload.

## Structure

- `packages/fern`: one reusable package with components, themes, and compiled CSS.
- `apps/docs`: documentation in MDX; visual samples and playgrounds in TSX.
- `scripts/check-package.mjs`: verify a tarball in a clean application.

## Verify

```sh
pnpm check
pnpm typecheck
pnpm test
pnpm build
pnpm pack:check
```

`pnpm format` applies Biome to code and Prettier to Markdown/MDX. Generated tokens are excluded from formatting. `pack:check` creates a consumer in the operating system's temporary directory, installs the tarball without overrides, checks types and behavior, and builds without Tailwind. It does not publish anything.

Automatic CI is disabled during early development. The GitHub Actions workflow can run these checks manually, using Ubuntu, Node 22, and the pnpm version declared in `package.json`.

Tests cover color fidelity, selected contrast pairs, Button behavior, and MDX. When changing shared CSS, themes, or embedding behavior, open `/checks/mediawiki.html` during development to check that host controls retain their styling. See the [Docs README](apps/docs/README.md) for the manual check.

## Package status

The private root workspace is named `fern`. The package `@taxon-labs/fern` is an unpublished alpha with a provisional npm scope. Changes are recorded in [CHANGELOG.md](CHANGELOG.md).

Fern is licensed under `GPL-2.0-or-later`. See [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md).

Fern uses Solid 2 RC and Kobalte alpha. Upstream peer compatibility remains a release blocker; SSR/hydration is not verified. See [package compatibility](packages/fern/README.md#compatibility-and-license) for tested versions and the release check.
