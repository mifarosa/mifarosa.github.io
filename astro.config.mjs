// @ts-check
import { defineConfig } from 'astro/config';

// Custom domain served from the site root, so no `base` is needed
export default defineConfig({
  site: 'https://mifarosa.com',
  markdown: {
    // Code highlighting for both themes; global.css switches between them
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
