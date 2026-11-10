// Feed RSS de noticias con el texto completo del aviso: /portal/noticias/rss.xml
// Lo usa el escenario de Make que publica en LinkedIn vía Buffer. Ver src/utils/newsFeed.ts
import type { APIRoute } from 'astro';
import { buildNewsFeed } from '../../../utils/newsFeed';

export const GET: APIRoute = async ({ site }) =>
  new Response(await buildNewsFeed(site, 'full'), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
