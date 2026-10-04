import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { readColors } from '../scripts/codex-colors.mjs';

const css = await readFile('src/foundations/tokens.css', 'utf8');
const json = JSON.parse(await readFile('src/foundations/colors.json', 'utf8'));
const styles = await readFile('src/styles.css', 'utf8');
const blocks = [...css.matchAll(/\.fern[^{}]*\{([^}]+)\}/g)];

const parse = (text) =>
  Object.fromEntries(
    [...text.matchAll(/--fern-([\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [key, value.trim()]),
  );

for (const [index, mode] of ['light', 'dark'].entries()) {
  test(`${mode}: all 287 Codex values are preserved apart from whitespace`, async () => {
    const official = await readColors(mode, false);

    const canonical = (values) =>
      Object.fromEntries(
        Object.entries(values).map(([name, value]) => [name, value.replace(/\s+/g, '')]),
      );

    assert.equal(Object.keys(official).length, 287);
    assert.deepEqual(canonical(parse(blocks[index][1])), canonical(official));
    assert.deepEqual(canonical(json[mode]), canonical(official));
    assert.deepEqual(parse(blocks[index][1]), json[mode]);
    assert.ok(!/\(\s|\s\)/.test(Object.values(json[mode]).join('\n')));
  });
}

function luminance(hex) {
  let value = hex.slice(1);

  if (value.length === 3) {
    value = [...value].map((c) => c + c).join('');
  }

  const rgb = value
    .match(/../g)
    .map((c) => parseInt(c, 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));

  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((a, b) => b - a);

  return (high + 0.05) / (low + 0.05);
}

test('used text and focus pairs meet their contrast thresholds in both themes', () => {
  for (const colors of Object.values(json)) {
    const pairs = [
      ['color-base', 'background-color-base', 4.5],
      ['color-subtle', 'background-color-neutral-subtle', 4.5],
      ['color-progressive', 'background-color-base', 4.5],
      ['border-color-progressive--focus', 'background-color-base', 3],
      ...['progressive', 'destructive'].flatMap((role) =>
        ['', '--hover', '--active'].map((state) => [
          'color-inverted-fixed',
          `background-color-${role}${state}`,
          4.5,
        ]),
      ),
      ...[
        'neutral',
        'interactive--hover',
        'interactive--active',
        'interactive-subtle--hover',
        'interactive-subtle--active',
      ].map((role) => ['color-base', `background-color-${role}`, 4.5]),
    ];

    for (const [fg, bg, minimum] of pairs) {
      assert.ok(contrast(colors[fg], colors[bg]) >= minimum, `${fg} on ${bg}`);
    }
  }
});

test('component color references exist upstream, without hex literals or Preflight imports', () => {
  for (const [, token] of styles.matchAll(
    /var\(--fern-((?:color|background-color|border-color)-[\w-]+)\)/g,
  )) {
    assert.ok(token in json.light && token in json.dark, token);
  }

  assert.ok(!styles.includes('preflight'));
  assert.ok(!/#(?:[a-f\d]{3}){1,2}\b/i.test(styles));
});
