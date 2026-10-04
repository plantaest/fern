import solid from '@solidjs/vite-plugin';
import tailwind from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid(), tailwind()],
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        index: 'src/build.ts',
        button: 'src/components/button/button.tsx',
        icon: 'src/components/icon.tsx',
      },
      formats: ['es'],
      fileName: (_format, name) => `${name}.js`,
      cssFileName: 'styles',
    },
    rollupOptions: {
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
