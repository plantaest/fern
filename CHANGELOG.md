# Changelog

## 0.1.0-alpha.0 (unreleased)

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
