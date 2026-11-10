// Feeds RSS de noticias para publicar avisos en redes (Make → Buffer → LinkedIn / Bluesky).
// - 'full' (/portal/noticias/rss.xml): texto completo del aviso; lo usa LinkedIn.
// - 'bluesky' (/portal/noticias/rss-bluesky.xml): texto recortado para que el aviso entero
//   («texto #hashtags enlace») quepa en los 300 caracteres de Bluesky.
// Solo noticias con fecha exacta (datePrecision 'day'), no futuras y sin social.enabled = false.
// Las noticias están en español: el enlace apunta a la versión ES del portal.
// Sin dependencias: se genera el XML a mano.
import { getCollection } from 'astro:content';
import { getItemSlug, getLocalizedPath, CONTENT_SOURCE_LOCALE, PORTAL_BASE } from './i18n';

export type FeedVariant = 'full' | 'bluesky';

const MAX_ITEMS = 20;
const DEFAULT_IMAGE = '/assets/images/og-default.png';
export const BLUESKY_MAX = 300; // límite de Bluesky, en grafemas

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const imageType = (url: string) => {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml' } as Record<string, string>)[ext || ''] || 'image/jpeg';
};

const segmenter = new Intl.Segmenter('es', { granularity: 'grapheme' });
const graphemes = (s: string) => [...segmenter.segment(s)].map(g => g.segment);

// Recorta en el último espacio antes del límite y añade «…»
export function truncate(text: string, max: number): string {
  const g = graphemes(text);
  if (g.length <= max) return text;
  const cut = g.slice(0, Math.max(0, max - 1)).join('');
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:—–-]+$/, '')}…`;
}

export async function buildNewsFeed(site: URL | undefined, variant: FeedVariant): Promise<string> {
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
      const tags = hashtags.join(' ');
      let text = (n.data.social.text || n.data.summary || n.data.title).trim();
      if (variant === 'bluesky') {
        // El escenario de Make publica «descripción + espacio + enlace»
        const reserved = graphemes(link).length + 1 + (tags ? graphemes(tags).length + 1 : 0);
        text = truncate(text, BLUESKY_MAX - reserved);
      }
      const description = tags ? `${text} ${tags}` : text;
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

  const feedPath = variant === 'bluesky' ? 'rss-bluesky.xml' : 'rss.xml';
  const feedUrl = abs(`${PORTAL_BASE}/noticias/${feedPath}`);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">',
    '  <channel>',
    `    <title>Lipids &amp; Liver · Noticias${variant === 'bluesky' ? ' (Bluesky)' : ''}</title>`,
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
}
