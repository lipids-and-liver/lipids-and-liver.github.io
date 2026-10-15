import { LOCALES, DEFAULT_LOCALE, getAllSlugs, type Locale } from './i18n';

// El idioma por defecto se sirve sin prefijo (/portal/...); el resto con /portal/<lang>/...
export const langParam = (l: Locale) => (l === DEFAULT_LOCALE ? undefined : l);

export const localePaths = () =>
  LOCALES.map(l => ({ params: { lang: langParam(l) }, props: { lang: l } }));

export async function localeSlugPaths(collection: Parameters<typeof getAllSlugs>[0]) {
  const slugs = await getAllSlugs(collection);
  return LOCALES.flatMap(l => slugs.map(id => ({ params: { lang: langParam(l), id }, props: { lang: l } })));
}
