import { getCollection, type CollectionEntry } from 'astro:content';
import translationsData from '../data/translations.json';

export type Locale = 'es' | 'eu' | 'en';
export const DEFAULT_LOCALE: Locale = 'es';
export const LOCALES: Locale[] = ['es', 'eu', 'en'];

export type Translations = typeof translationsData.es;

export function getTranslations(lang: Locale = DEFAULT_LOCALE): Translations {
  return (translationsData[lang] || translationsData[DEFAULT_LOCALE]) as Translations;
}

export function getItemSlug(entry: { id: string; data?: { id?: string } }): string {
  if (entry.data?.id) return entry.data.id;
  const parts = entry.id.split('/');
  return parts.length > 1 ? parts.slice(1).join('/') : parts[0];
}

export function getItemLang(entry: { id: string }): Locale {
  const parts = entry.id.split('/');
  const prefix = parts[0];
  if (prefix === 'eu' || prefix === 'en' || prefix === 'es') {
    return prefix;
  }
  return 'es';
}

export function getPathWithoutLocale(pathname: string): string {
  // Normalize leading slash and remove any trailing .html or index.html
  let clean = pathname.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  // Remove /eu or /en prefix (e.g. /eu, /eu/, /eu/tesis, /en/curriculum)
  clean = clean.replace(/^\/(eu|en)(\/|$)/, '/');
  // Ensure starts with /
  if (!clean.startsWith('/')) clean = '/' + clean;
  // If ends with trailing slash (except root /), strip it for consistent joining
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean === '' ? '/' : clean;
}

export function getLocalizedPath(path: string, lang: Locale = DEFAULT_LOCALE): string {
  // In-page anchor like #hero or #lines
  if (path.startsWith('#')) {
    return lang === DEFAULT_LOCALE ? `/${path}` : `/${lang}/${path}`;
  }

  // If path already has hash at end, e.g. /#lines
  const parts = path.split('#');
  const urlPath = parts[0];
  const hashSuffix = parts.length > 1 ? `#${parts[1]}` : '';

  // Clean the urlPath
  const clean = getPathWithoutLocale(urlPath);

  let localized = clean;
  if (lang !== DEFAULT_LOCALE) {
    localized = clean === '/' ? (hashSuffix ? `/${lang}/` : `/${lang}`) : `/${lang}${clean}`;
  }

  return `${localized}${hashSuffix}`;
}

export type LocalizedItem<T> = T & { slug: string; locale: Locale };

export async function getLocalizedCollection<C extends 'theses' | 'team' | 'research' | 'publications' | 'presentation' | 'training'>(
  collectionName: C,
  lang: Locale = DEFAULT_LOCALE
): Promise<Array<CollectionEntry<C> & { slug: string; locale: Locale }>> {
  const allEntries = await getCollection(collectionName);

  // Group by slug
  const grouped = new Map<string, Map<Locale, CollectionEntry<C>>>();

  for (const entry of allEntries) {
    const slug = getItemSlug(entry);
    const itemLang = getItemLang(entry);

    if (!grouped.has(slug)) {
      grouped.set(slug, new Map());
    }
    grouped.get(slug)!.set(itemLang, entry);
  }

  const result: Array<CollectionEntry<C> & { slug: string; locale: Locale }> = [];

  for (const [slug, langMap] of grouped.entries()) {
    let selected: CollectionEntry<C> | undefined = langMap.get(lang);
    let selectedLocale: Locale = lang;

    if (!selected) {
      // Fallback to Spanish
      selected = langMap.get(DEFAULT_LOCALE);
      selectedLocale = DEFAULT_LOCALE;
    }

    if (!selected) {
      // Fallback to any available language
      const [firstLocale, firstEntry] = langMap.entries().next().value || [];
      selected = firstEntry;
      selectedLocale = (firstLocale as Locale) || DEFAULT_LOCALE;
    }

    if (selected) {
      result.push(Object.assign(selected, { slug, locale: selectedLocale }));
    }
  }

  return result;
}

export async function getLocalizedEntry<C extends 'theses' | 'team' | 'research' | 'publications' | 'presentation' | 'training'>(
  collectionName: C,
  slug: string,
  lang: Locale = DEFAULT_LOCALE
): Promise<(CollectionEntry<C> & { slug: string; locale: Locale }) | undefined> {
  const allEntries = await getCollection(collectionName);
  
  let targetEntry: CollectionEntry<C> | undefined;
  let fallbackEntry: CollectionEntry<C> | undefined;

  for (const entry of allEntries) {
    const itemSlug = getItemSlug(entry);
    if (itemSlug === slug) {
      const itemLang = getItemLang(entry);
      if (itemLang === lang) {
        targetEntry = entry;
        break;
      }
      if (itemLang === DEFAULT_LOCALE) {
        fallbackEntry = entry;
      }
    }
  }

  const chosen = targetEntry || fallbackEntry;
  if (!chosen) return undefined;

  const chosenLang = getItemLang(chosen);
  return Object.assign(chosen, { slug, locale: chosenLang });
}

export async function getAllSlugs<C extends 'theses' | 'team' | 'research' | 'publications' | 'presentation' | 'training'>(
  collectionName: C
): Promise<string[]> {
  const allEntries = await getCollection(collectionName);
  const slugSet = new Set<string>();
  for (const entry of allEntries) {
    slugSet.add(getItemSlug(entry));
  }
  return Array.from(slugSet);
}
