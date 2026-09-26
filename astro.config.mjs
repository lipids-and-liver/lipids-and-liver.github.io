import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Static site generation (SSG) output
  output: 'static',
  build: {
    format: 'directory'
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'eu', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
