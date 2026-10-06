// @ts-check
import { defineConfig } from 'astro/config';
// Astro's default Markdown processor; keep its version equal to the one astro depends on
import { satteri } from '@astrojs/markdown-satteri';
import { looseTables } from './src/plugins/loose-tables.mjs';

// Custom domain served from the site root, so no `base` is needed
export default defineConfig({
  site: 'https://mifarosa.com',
  markdown: {
    processor: satteri({ mdastPlugins: [looseTables] }),
    // Code highlighting for both themes; global.css switches between them
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
