// Entidades financiadoras (src/data/funders.json, editable desde el CMS).
// Los textos van en español en el campo base y en <campo>_eu / <campo>_en.
import fundersData from '../data/funders.json';
import type { Locale } from './i18n';

export interface Funder {
  id: string;
  name: string;
  program: string;
  reference?: string;
  logo: string;
  url?: string;
  footer: boolean;
}

export function getFunders(lang: Locale): Funder[] {
  const pick = (f: any, key: string): string => (f[`${key}_${lang}`] || f[key] || '').toString().trim();
  return [...((fundersData as any).funders || [])]
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .map(f => ({
      id: f.id,
      name: pick(f, 'name'),
      program: pick(f, 'program'),
      reference: (f.reference || '').toString().trim() || undefined,
      logo: f.logo,
      url: f.url || undefined,
      footer: f.footer !== false,
    }));
}
