# Fern

A Wikimedia-first design system for Taxon Labs applications. Fern Docs currently supports exploring foundations and components and will grow into the official documentation. Principles and conventions are in [AGENTS.md](AGENTS.md).

## Develop

Use pnpm 8.15.5 and Node 22.12 or newer. Codex's own tooling declares a newer Node requirement; Fern reads its prebuilt color and icon data, tested on Node 22.19.0.

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

The private root workspace is named `fern`. The local package name `@taxon-labs/fern` is provisional and unpublished; the unscoped npm name `fern` is already in use. Start with alpha versions; record changes in [CHANGELOG.md](CHANGELOG.md).

Fern is licensed under `GPL-2.0-or-later`. See [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md).

The tested combination is Solid and `@solidjs/web` `2.0.0-rc.13`, with Kobalte `2.0.0-alpha.2`. Kobalte and its utils package declare older Solid peers; verify installation independently of development overrides. Resolve upstream peer compatibility before claiming strict-install or stable release support. `pnpm release:check` also requires strict peer resolution; it is a release gate, currently expected to fail on Kobalte peer metadata. SSR/hydration is not yet verified.

See the [package README](packages/fern/README.md) for usage and exports.
