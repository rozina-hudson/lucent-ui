import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    exclude: ['dist-server/**', 'node_modules/**', 'dist/**', 'dist-cli/**', 'website/**'],
  },
});
