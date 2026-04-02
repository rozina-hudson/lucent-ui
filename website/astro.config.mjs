import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://lucentui.ai',
  output: 'static',
  integrations: [react(), sitemap()],
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
