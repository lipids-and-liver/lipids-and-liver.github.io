import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

const isDev = process.argv.includes('dev') || process.env.NODE_ENV === 'development';

// https://astro.build/config
export default defineConfig({
  // Static site generation (SSG) output
  output: 'static',
  integrations: [
    react(),
    ...(isDev ? [keystatic()] : [])
  ],
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
