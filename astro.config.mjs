import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://lipids-and-liver.github.io',
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
  },
  redirects: {
    '/curriculum': '/portal/curriculum',
    '/curriculum/[id]': '/portal/curriculum/[id]',
    '/tesis': '/portal/tesis',
    '/tesis/[id]': '/portal/tesis/[id]',
    '/publicaciones': '/portal/publicaciones',
    '/lineas': '/portal/lineas',
    '/lineas/[id]': '/portal/lineas/[id]',
  }
});
