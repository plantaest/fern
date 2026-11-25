import solid from '@solidjs/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid()],
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        index: 'src/build.ts',
        'aspect-ratio': 'src/components/aspect-ratio/aspect-ratio.tsx',
        badge: 'src/components/badge/badge.tsx',
        button: 'src/components/button/button.tsx',
        'button-group': 'src/components/button-group/button-group.tsx',
        collapsible: 'src/components/collapsible/collapsible.tsx',
        icon: 'src/components/icon/icon.tsx',
        kbd: 'src/components/kbd/kbd.tsx',
        message: 'src/components/message/message.tsx',
        separator: 'src/components/separator/separator.tsx',
        skeleton: 'src/components/skeleton/skeleton.tsx',
        spinner: 'src/components/spinner/spinner.tsx',
        'toggle-button': 'src/components/toggle-button/toggle-button.tsx',
        'toggle-button-group': 'src/components/toggle-button-group/toggle-button-group.tsx',
      },
      formats: ['es'],
      fileName: (_format, name) => `${name}.js`,
      cssFileName: 'styles',
    },
    rolldownOptions: {
      external: (id) =>
        [
          'solid-js',
          '@solidjs/web',
          '@kobalte/core',
          '@wikimedia/codex-icons',
          'class-variance-authority',
        ].some((name) => id === name || id.startsWith(`${name}/`)),
    },
  },
  test: { environment: 'jsdom', include: ['src/**/*.test.tsx'] },
});
