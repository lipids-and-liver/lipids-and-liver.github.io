// Feed RSS de noticias: /portal/noticias/rss.xml
// Lo leen los servicios que publican avisos en redes (Buffer, Make, Zapier…).
// - Solo noticias con fecha exacta (datePrecision 'day'), no futuras y sin social.enabled = false.
// - Las noticias están en español: el enlace apunta a la versión ES del portal.
// - La descripción es el texto del aviso (social.text) o, si no hay, el resumen; con los hashtags al final.
// Sin dependencias: se genera el XML a mano.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getItemSlug, getLocalizedPath, CONTENT_SOURCE_LOCALE, PORTAL_BASE } from '../../../utils/i18n';

const MAX_ITEMS = 20;
const DEFAULT_IMAGE = '/assets/images/og-default.png';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const imageType = (url: string) => {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml' } as Record<string, string>)[ext || ''] || 'image/jpeg';
};

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://lipids-and-liver.github.io');
  const abs = (path: string) => new URL(path, base).href;
  const today = new Date().toISOString().slice(0, 10);

  const items = (await getCollection('news'))
    .filter(n => n.data.datePrecision === 'day' && /^\d{4}-\d{2}-\d{2}$/.test(n.data.date) && n.data.date <= today)
    .filter(n => n.data.social.enabled)
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
    .slice(0, MAX_ITEMS)
    .map(n => {
      const slug = getItemSlug(n);
      const link = abs(`${getLocalizedPath(`/noticias/${slug}`, CONTENT_SOURCE_LOCALE)}/`);
      const hashtags = n.data.social.hashtags.map(h => `#${h.replace(/^#/, '').replace(/\s+/g, '')}`).filter(h => h.length > 1);
      const text = (n.data.social.text || n.data.summary || n.data.title).trim();
      const description = hashtags.length ? `${text} ${hashtags.join(' ')}` : text;
      const image = n.data.image ? (/^https?:\/\//.test(n.data.image) ? n.data.image : abs(n.data.image.startsWith('/') ? n.data.image : `/${n.data.image}`)) : abs(DEFAULT_IMAGE);
      // Mediodía UTC para que la fecha no cambie de día en ningún huso horario
      const pubDate = new Date(`${n.data.date}T12:00:00Z`).toUTCString();
      return [
        '    <item>',
        `      <title>${escapeXml(n.data.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(description)}</description>`,
        ...hashtags.map(h => `      <category>${escapeXml(h.slice(1))}</category>`),
        `      <media:content url="${escapeXml(image)}" medium="image" type="${imageType(image)}" />`,
        '    </item>',
      ].join('\n');
    });

  const feedUrl = abs(`${PORTAL_BASE}/noticias/rss.xml`);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">',
    '  <channel>',
    '    <title>Lipids &amp; Liver · Noticias</title>',
    `    <link>${escapeXml(abs(`${getLocalizedPath('/noticias', CONTENT_SOURCE_LOCALE)}/`))}</link>`,
    '    <description>Noticias del grupo de investigación Lipids &amp; Liver (EHU)</description>',
    `    <language>${CONTENT_SOURCE_LOCALE}</language>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
