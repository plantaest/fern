import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { compile } from 'tailwindcss';
import { readColors } from '../scripts/colors.mjs';

const css = await readFile('src/foundations/colors.css', 'utf8');
const json = JSON.parse(await readFile('src/foundations/colors.json', 'utf8'));
const styles = (
  await Promise.all(
    [
      'src/styles.css',
      'src/tailwind.css',
      'src/foundations/base.css',
      'src/foundations/prose.css',
      'src/components/icon/icon.css',
      'src/components/button/button.css',
    ].map((file) => readFile(file, 'utf8')),
  )
).join('\n');
const blocks = [...css.matchAll(/\.fern[^{}]*\{([^}]+)\}/g)];

const parse = (text) =>
  Object.fromEntries(
    [...text.matchAll(/--fern-([\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [key, value.trim()]),
  );

for (const [index, mode] of ['light', 'dark'].entries()) {
  test(`${mode}: all 287 Codex values are preserved with Fern's numbered token names`, async () => {
    const official = await readColors(mode, false);
    const generated = parse(blocks[index][1]);

    const expected = Object.fromEntries(
      Object.entries(official).map(([name, value]) => [
        name.replace(/([a-z])(\d+)/g, '$1-$2'),
        value,
      ]),
    );

    const canonical = (values) =>
      Object.fromEntries(
        Object.entries(values).map(([name, value]) => [name, value.replace(/\s+/g, '')]),
      );

    assert.equal(Object.keys(official).length, 287);
    assert.deepEqual(canonical(generated), canonical(expected));
    assert.deepEqual(canonical(json[mode]), canonical(expected));
    assert.deepEqual(generated, json[mode]);
    assert.ok(Object.keys(json[mode]).every((name) => !/[a-z]\d/.test(name)));
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
  for (const [mode, colors] of Object.entries(json)) {
    const pairs = [
      ['color-base', 'background-color-base', 4.5],
      ['color-subtle', 'background-color-neutral-subtle', 4.5],
      ['color-progressive', 'background-color-base', 4.5],
      ...['', '--hover', '--active'].map((state) => [
        `color-visited${state}`,
        'background-color-base',
        4.5,
      ]),
      ['border-color-progressive--focus', 'background-color-base', 3],
      ...['progressive', 'destructive'].flatMap((role) =>
        ['', '--hover', '--active'].flatMap((state) => [
          ['color-inverted-fixed', `background-color-${role}${state}`, 4.5],
          [`color-${role}${state}`, `background-color-${role}-subtle${state}`, 4.5],
          [`color-${role}${state}`, 'background-color-base', 4.5],
        ]),
      ),
      ...[
        'base',
        'interactive-subtle',
        'interactive-subtle--hover',
        'interactive-subtle--active',
      ].map((role) => ['color-neutral', `background-color-${role}`, 4.5]),
      ...['neutral', 'interactive--hover', 'interactive--active'].map((role) => [
        'color-base',
        `background-color-${role}`,
        4.5,
      ]),
    ];

    for (const [fg, bg, minimum] of pairs) {
      assert.ok(contrast(colors[fg], colors[bg]) >= minimum, `${mode}: ${fg} on ${bg}`);
    }
  }
});

test('style references resolve to declared tokens and upstream colors, without hex literals or Preflight', () => {
  const declared = new Set(
    [...`${css}\n${styles}`.matchAll(/--fern-([\w-]+):/g)].map(([, name]) => name),
  );

  for (const [, token] of styles.matchAll(/var\(--fern-([\w-]+)/g)) {
    assert.ok(declared.has(token), token);
  }

  for (const [, token] of styles.matchAll(
    /var\(--fern-((?:color|background-color|border-color)-[\w-]+)\)/g,
  )) {
    assert.ok(token in json.light && token in json.dark, token);
  }

  assert.ok(!styles.includes('preflight'));
  assert.ok(!/#(?:[a-f\d]{3}){1,2}\b/i.test(styles));
});

test('Tailwind utilities preserve typography and semantic color token roles', async () => {
  const adapter = await readFile('src/tailwind.css', 'utf8');
  const compiler = await compile(`${adapter}\n@tailwind utilities;`, {
    loadStylesheet: async (id) => {
      const path = fileURLToPath(import.meta.resolve(id));

      return { path, base: dirname(path), content: await readFile(path, 'utf8') };
    },
  });

  const sizes = [
    ['text-xs', 'x-small'],
    ['text-xl', 'x-large'],
  ];
  const typography = [
    ...sizes,
    ['text-body', 'medium', 'normal'],
    ['text-small', 'small', 'small'],
    ['text-extra-small', 'x-small', 'small'],
    ['text-heading-3', 'x-large', 'large'],
  ];
  const expectations = [
    ...typography.flatMap(([name, size, leading]) => [
      [name, 'font-size', `font-size-${size}`],
      ...(leading ? [[name, 'line-height', `line-height-${leading}`]] : []),
    ]),
    ['leading-sm', 'line-height', 'line-height-small'],
    ['leading-normal', 'line-height', 'line-height-normal'],
    ['text-content-base', 'color', 'color-base'],
    ['bg-surface-base', 'background-color', 'background-color-base'],
    ['border-line-base', 'border-color', 'border-color-base'],
    ['text-content-progressive', 'color', 'color-progressive'],
    ['bg-surface-progressive', 'background-color', 'background-color-progressive'],
    ['border-line-progressive', 'border-color', 'border-color-progressive'],
    ['accent-surface-progressive', 'accent-color', 'background-color-progressive'],
  ];
  const css = compiler.build([...new Set(expectations.map(([name]) => name))]);
  const rule = (name) => css.match(new RegExp(`\\.${name} \\{([^}]+)\\}`))?.[1] ?? '';

  for (const [name, property, token] of expectations) {
    assert.match(
      rule(name),
      new RegExp(`${property}: [^;]*var\\(--fern-${token}\\)`),
      `${name}: ${property} uses --fern-${token}`,
    );
  }

  for (const [name] of sizes) {
    assert.ok(!rule(name).includes('line-height:'), `${name} sets size without leading`);
    assert.ok(!rule(name).includes('color:'), `${name} sets size without color`);
  }
});
