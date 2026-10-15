import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://lipids-and-liver.github.io',
  // Static site generation (SSG) output
  output: 'static',
  build: {
    format: 'directory'
  },
  // Idiomas: las rutas son manuales (no se usa el i18n de Astro). La fuente de verdad del
  // portal es src/utils/i18n.ts (DEFAULT_LOCALE = 'en'); la raíz "En construcción" usa 'es'.
  redirects: {
    '/curriculum': '/portal/curriculum',
    '/tesis': '/portal/tesis',
    '/publicaciones': '/portal/publicaciones',
    '/lineas': '/portal/lineas',
  }
});
