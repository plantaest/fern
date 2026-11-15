import solid from '@solidjs/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid()],
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        index: 'src/build.ts',
        button: 'src/components/button/button.tsx',
        icon: 'src/components/icon/icon.tsx',
        message: 'src/components/message/message.tsx',
        separator: 'src/components/separator/separator.tsx',
        skeleton: 'src/components/skeleton/skeleton.tsx',
        'toggle-button': 'src/components/toggle-button/toggle-button.tsx',
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
