import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        'lucent-ui': resolve(__dirname, '../src/index.ts'),
      },
    },
    // The library source uses .js extensions pointing to .ts files.
    // Vite resolves these automatically in dev; this ensures it also
    // works during the Astro static build.
    optimizeDeps: {
      exclude: ['lucent-ui'],
    },
  },
});
