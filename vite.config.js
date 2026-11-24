import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const pageNames = ['index', 'about', 'rx-live', 'rx-learn', 'rx-aspire', 'rx-exam'];

export default defineConfig({
  appType: 'mpa',
  server: {
    watch: {
      ignored: ['**/images/**', '**/.git/**'],
    },
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(pageNames.map((name) => [name, resolve(import.meta.dirname, `${name}.html`)])),
    },
  },
  plugins: [
    {
      name: 'copy-static-site-assets',
      closeBundle() {
        const root = resolve(import.meta.dirname);
        const output = resolve(root, 'dist');
        for (const folder of ['images', 'plugins', 'fonts', 'section-css']) {
          const source = resolve(root, folder);
          if (existsSync(source)) cpSync(source, resolve(output, folder), { recursive: true });
        }
      },
    },
  ],
});
