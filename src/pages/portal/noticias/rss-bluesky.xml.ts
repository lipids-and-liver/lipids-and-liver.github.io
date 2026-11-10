// Feed RSS de noticias con el aviso recortado a 300 caracteres: /portal/noticias/rss-bluesky.xml
// Lo usa el escenario de Make que publica en Bluesky vía Buffer. Ver src/utils/newsFeed.ts
import type { APIRoute } from 'astro';
import { buildNewsFeed } from '../../../utils/newsFeed';

export const GET: APIRoute = async ({ site }) =>
  new Response(await buildNewsFeed(site, 'bluesky'), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
