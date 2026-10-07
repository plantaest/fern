import type { HighlighterCore } from 'shiki/core';

export type CodeToken = {
  content: string;
  light: string;
  dark: string;
};

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
    import('shiki/langs/tsx.mjs'),
    import('shiki/langs/css.mjs'),
    import('shiki/langs/html.mjs'),
    import('shiki/themes/github-light-default.mjs'),
    import('shiki/themes/github-dark-default.mjs'),
  ]).then(([core, engine, tsx, css, html, light, dark]) =>
    core.createHighlighterCore({
      engine: engine.createJavaScriptRegexEngine(),
      langs: [tsx.default, css.default, html.default],
      themes: [light.default, dark.default],
    }),
  );

  return highlighter;
}

function syntaxColor(color?: string) {
  // GitHub's muted foreground needs more contrast on Fern's code-block background.
  return color?.toLowerCase() === '#6e7781' ? 'var(--fern-color-subtle)' : (color ?? 'inherit');
}

export async function highlightCode(
  code: string,
  language: string,
): Promise<CodeToken[] | undefined> {
  const lang = language.toLowerCase();

  if (!['tsx', 'css', 'html'].includes(lang)) return;

  const instance = await getHighlighter();
  const lines = instance.codeToTokensWithThemes(code, {
    lang,
    themes: { light: 'github-light-default', dark: 'github-dark-default' },
  });
  const newlines = code.match(/\r?\n/g) ?? [];

  return lines.flatMap((line, index) => [
    ...(index ? [{ content: newlines[index - 1], light: 'inherit', dark: 'inherit' }] : []),
    ...line.map((token) => ({
      content: token.content,
      light: syntaxColor(token.variants.light.color),
      dark: syntaxColor(token.variants.dark.color),
    })),
  ]);
}
