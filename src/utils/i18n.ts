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

export const PORTAL_BASE = '/portal';

export function getPathWithoutLocale(pathname: string): string {
  // Normalize leading slash and remove any trailing .html or index.html
  let clean = pathname.replace(/\/index\.html$/, '').replace(/\.html$/, '');

  // If inside portal, strip PORTAL_BASE
  if (clean === PORTAL_BASE) {
    clean = '/';
  } else if (clean.startsWith(`${PORTAL_BASE}/`)) {
    clean = clean.slice(PORTAL_BASE.length);
  }

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
    return lang === DEFAULT_LOCALE ? `${PORTAL_BASE}/${path}` : `${PORTAL_BASE}/${lang}/${path}`;
  }

  // If path already has hash at end, e.g. /#lines
  const parts = path.split('#');
  const urlPath = parts[0];
  const hashSuffix = parts.length > 1 ? `#${parts[1]}` : '';

  // Clean the urlPath
  const clean = getPathWithoutLocale(urlPath);

  let localized = clean;
  if (lang !== DEFAULT_LOCALE) {
    localized = clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
  }

  // Prepend PORTAL_BASE
  const fullPath = localized === '/' ? `${PORTAL_BASE}/` : `${PORTAL_BASE}${localized}`;
  return `${fullPath}${hashSuffix}`;
}

export type LocalizedItem<T> = T & { slug: string; locale: Locale };

export async function getLocalizedCollection<C extends 'theses' | 'team' | 'research' | 'publications' | 'presentation' | 'training' | 'projects' | 'news' | 'letter'>(
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

  if (collectionName === 'team') {
    sortTeamMembers(result as any);
  }

  return result;
}

export async function getLocalizedEntry<C extends 'theses' | 'team' | 'research' | 'publications' | 'presentation' | 'training' | 'projects' | 'news' | 'letter'>(
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

export async function getAllSlugs<C extends 'theses' | 'team' | 'research' | 'publications' | 'presentation' | 'training' | 'projects' | 'news' | 'letter'>(
  collectionName: C
): Promise<string[]> {
  const allEntries = await getCollection(collectionName);
  const slugSet = new Set<string>();
  for (const entry of allEntries) {
    slugSet.add(getItemSlug(entry));
  }
  return Array.from(slugSet);
}

export function getTeamCategoryInfo(category: string = '', lang: Locale = DEFAULT_LOCALE): {
  key: string;
  label: string;
  icon: string;
} {
  const t = getTranslations(lang);
  const cat = category.toLowerCase();

  if (cat.includes('coordinador') || cat.includes('koordinatzaile') || cat.includes('coordinator')) {
    return {
      key: 'leadership',
      label: t.team_badge_leadership,
      icon: 'fas fa-crown'
    };
  }
  if (cat.includes('ramón y cajal') || cat.includes('ramon y cajal') || cat.includes('ryb') || cat.includes('ryc')) {
    return {
      key: 'ryc',
      label: t.team_badge_ryc,
      icon: 'fas fa-award'
    };
  }
  if (cat.includes('posdoctoral') || cat.includes('postdoc') || cat.includes('doktoretza-osteko')) {
    return {
      key: 'postdoc',
      label: t.team_badge_postdoc,
      icon: 'fas fa-microscope'
    };
  }
  if (cat.includes('predoctoral') || cat.includes('predoc') || cat.includes('doktorego-aurreko')) {
    return {
      key: 'predoc',
      label: t.team_badge_predoc,
      icon: 'fas fa-user-edit'
    };
  }
  if (cat.includes('técnico') || cat.includes('tecnico') || cat.includes('tech') || cat.includes('teknikari')) {
    return {
      key: 'tech',
      label: t.team_badge_tech,
      icon: 'fas fa-flask'
    };
  }

  // Default to PDI & Senior (Directora, Investigador Senior, PDI, etc.)
  return {
    key: 'pdi',
    label: t.team_badge_pdi,
    icon: 'fas fa-user-graduate'
  };
}

export function getTeamCategoryRank(category: string = ''): number {
  const cat = category.toLowerCase().trim();

  // 1. Coordinación / IP
  if (cat.includes('coordinador') || cat.includes('koordinatzaile') || cat.includes('coordinator')) {
    return 1;
  }
  // 2. Personal Docente e Investigador Senior (Líneas, Senior, Ramón y Cajal, PDI)
  if (
    cat.includes('directora') ||
    cat.includes('director') ||
    cat.includes('senior') ||
    cat.includes('ramón y cajal') ||
    cat.includes('ramon y cajal') ||
    cat.includes('ryc') ||
    cat === 'pdi' ||
    cat.includes('titular') ||
    cat.includes('agregad') ||
    cat.includes('catedr')
  ) {
    return 2;
  }
  // 3. Investigadores Posdoctorales
  if (cat.includes('posdoctoral') || cat.includes('postdoc') || cat.includes('doktoretza-osteko')) {
    return 3;
  }
  // 4. Investigadores Predoctorales / Doctorandos
  if (cat.includes('predoctoral') || cat.includes('predoc') || cat.includes('doktorego-aurreko')) {
    return 4;
  }
  // 5. Personal Técnico de Apoyo
  if (cat.includes('técnico') || cat.includes('tecnico') || cat.includes('tech') || cat.includes('teknikari')) {
    return 5;
  }

  return 6;
}

export function sortTeamMembers<T extends { data: { category?: string; order?: number | string | null; name?: string } }>(members: T[]): T[] {
  return members.sort((a, b) => {
    const rankA = getTeamCategoryRank(a.data.category || '');
    const rankB = getTeamCategoryRank(b.data.category || '');
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    const orderA = typeof a.data.order === 'number' ? a.data.order : (Number(a.data.order) || 99);
    const orderB = typeof b.data.order === 'number' ? b.data.order : (Number(b.data.order) || 99);
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const nameA = a.data.name || '';
    const nameB = b.data.name || '';
    return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
  });
}

export function localizeTeamRole(role: string = '', lang: Locale = DEFAULT_LOCALE): string {
  if (lang === 'es' || !role) return role;

  const roleTranslations: Record<string, { eu: string; en: string }> = {
    'Catedrática de Fisiología': {
      eu: 'Fisiologiako Katedraduna',
      en: 'Professor of Physiology'
    },
    'Catedrático de Fisiología': {
      eu: 'Fisiologiako Katedraduna',
      en: 'Professor of Physiology'
    },
    'Catedrática de Fisiología - Coordinadora del Grupo Lipids & Liver': {
      eu: 'Fisiologiako Katedraduna - Lipids & Liver Taldearen Koordinatzailea',
      en: 'Professor of Physiology - Coordinator of Lipids & Liver Group'
    },
    'Profesor Titular de Universidad': {
      eu: 'Unibertsitateko Irakasle Titularra',
      en: 'Associate Professor'
    },
    'Profesora Titular de Universidad': {
      eu: 'Unibertsitateko Irakasle Titularra',
      en: 'Associate Professor'
    },
    'Profesora Titular de Universidad - Directora de Línea de Investigación': {
      eu: 'Unibertsitateko Irakasle Titularra - Ikerketa Lerroko Zuzendaria',
      en: 'Associate Professor - Research Line Director'
    },
    'Profesora Agregada': {
      eu: 'Irakasle Agregatua',
      en: 'Associate Professor (Agregada)'
    },
    'Profesora Agregada de Universidad': {
      eu: 'Unibertsitateko Irakasle Agregatua',
      en: 'Associate Professor (Agregada)'
    },
    'Investigador Ramón y Cajal': {
      eu: 'Ramón y Cajal Ikertzailea',
      en: 'Ramón y Cajal Research Fellow'
    },
    'Investigadora Ramón y Cajal': {
      eu: 'Ramón y Cajal Ikertzailea',
      en: 'Ramón y Cajal Research Fellow'
    },
    'Investigador Ramón y Cajal - Grupo Lipids & Liver': {
      eu: 'Ramón y Cajal Ikertzailea - Lipids & Liver Taldea',
      en: 'Ramón y Cajal Research Fellow - Lipids & Liver Group'
    },
    'Investigadora Ikerbasque Professor': {
      eu: 'Ikerbasque Professor Ikertzailea',
      en: 'Ikerbasque Research Professor'
    },
    'Investigador Senior': {
      eu: 'Ikertzaile Seniorra',
      en: 'Senior Researcher'
    },
    'Investigadora Senior': {
      eu: 'Ikertzaile Seniorra',
      en: 'Senior Researcher'
    },
    'Investigador Posdoctoral': {
      eu: 'Doktoretza-osteko Ikertzailea',
      en: 'Postdoctoral Researcher'
    },
    'Investigadora Posdoctoral': {
      eu: 'Doktoretza-osteko Ikertzailea',
      en: 'Postdoctoral Researcher'
    },
    'Investigador Predoctoral': {
      eu: 'Doktorego-aurreko Ikertzailea',
      en: 'Predoctoral Researcher'
    },
    'Investigadora Predoctoral': {
      eu: 'Doktorego-aurreko Ikertzailea',
      en: 'Predoctoral Researcher'
    },
    'Investigadora Predoctoral (Contrato FPU)': {
      eu: 'Doktorego-aurreko Ikertzailea (FPU Kontratua)',
      en: 'Predoctoral Researcher (FPU Contract)'
    },
    'Investigador Predoctoral (FPI)': {
      eu: 'Doktorego-aurreko Ikertzailea (FPI)',
      en: 'Predoctoral Researcher (FPI)'
    },
    'Investigador Predoctoral (UPV/EHU)': {
      eu: 'Doktorego-aurreko Ikertzailea (UPV/EHU)',
      en: 'Predoctoral Researcher (UPV/EHU)'
    },
    'Investigadora Predoctoral (UPV/EHU)': {
      eu: 'Doktorego-aurreko Ikertzailea (UPV/EHU)',
      en: 'Predoctoral Researcher (UPV/EHU)'
    },
    'Investigadora Predoctoral (Biocruces)': {
      eu: 'Doktorego-aurreko Ikertzailea (Biocruces)',
      en: 'Predoctoral Researcher (Biocruces)'
    },
    'Investigadora Predoctoral (FPU)': {
      eu: 'Doktorego-aurreko Ikertzailea (FPU)',
      en: 'Predoctoral Researcher (FPU)'
    },
    'Investigadora Predoctoral (Gobierno Vasco)': {
      eu: 'Doktorego-aurreko Ikertzailea (Eusko Jaurlaritza)',
      en: 'Predoctoral Researcher (Basque Government)'
    },
    'Técnico de Laboratorio': {
      eu: 'Laborategiko Teknikaria',
      en: 'Laboratory Technician'
    },
    'Técnica de Laboratorio': {
      eu: 'Laborategiko Teknikaria',
      en: 'Laboratory Technician'
    },
    'Técnico especialista de Laboratorio (Sanitario/Animalario)': {
      eu: 'Laborategiko Teknikari Espezialista (Osasuna/Animalitegia)',
      en: 'Specialist Laboratory Technician (Health/Animal Facility)'
    }
  };

  if (roleTranslations[role] && roleTranslations[role][lang]) {
    return roleTranslations[role][lang];
  }

  return role;
}

export function localizeTeamDepartment(dept: string = '', lang: Locale = DEFAULT_LOCALE): string {
  if (lang === 'es' || !dept) return dept;

  const deptTranslations: Record<string, { eu: string; en: string }> = {
    'Departamento de Fisiología, Facultad de Medicina y Enfermería': {
      eu: 'Fisiologia Saila, Medikuntza eta Erizaintza Fakultatea',
      en: 'Department of Physiology, Faculty of Medicine and Nursing'
    },
    'Departamento de Fisiología, Facultad de Medicina y Enfermería, UPV/EHU': {
      eu: 'Fisiologia Saila, Medikuntza eta Erizaintza Fakultatea, UPV/EHU',
      en: 'Department of Physiology, Faculty of Medicine and Nursing, UPV/EHU'
    },
    'Departamento de Fisiología / IIS Biocruces Bizkaia': {
      eu: 'Fisiologia Saila / Biocruces Bizkaia OII',
      en: 'Department of Physiology / IIS Biocruces Bizkaia'
    },
    'Departamento de Fisiología, Facultad de Medicina y Enfermería / IIS Biocruces': {
      eu: 'Fisiologia Saila, Medikuntza eta Erizaintza Fakultatea / Biocruces OII',
      en: 'Department of Physiology, Faculty of Medicine and Nursing / IIS Biocruces'
    },
    'Departamento de Fisiología, UPV/EHU / IIS Biocruces': {
      eu: 'Fisiologia Saila, UPV/EHU / Biocruces OII',
      en: 'Department of Physiology, UPV/EHU / IIS Biocruces'
    }
  };

  if (deptTranslations[dept] && deptTranslations[dept][lang]) {
    return deptTranslations[dept][lang];
  }

  return dept;
}

export function localizeTeamOffice(office: string = '', lang: Locale = DEFAULT_LOCALE): string {
  if (!office) {
    if (lang === 'eu') return 'Medikuntza eta Erizaintza Fakultatea, Leioa';
    if (lang === 'en') return 'Faculty of Medicine and Nursing, Leioa';
    return 'Facultad de Medicina y Enfermería, Leioa';
  }
  if (lang === 'es') return office;

  let localized = office;
  if (lang === 'en') {
    localized = localized
      .replace(/^Despacho\s*/i, 'Office ')
      .replace(/^Laboratorio\s*/i, 'Laboratory ')
      .replace(/Facultad de Medicina y Enfermería/i, 'Faculty of Medicine and Nursing');
  } else if (lang === 'eu') {
    localized = localized
      .replace(/^Despacho\s*([0-9.a-zA-Z]+)/i, '$1 Bulegoa')
      .replace(/^Laboratorio\s*([0-9.a-zA-Z]+)/i, '$1 Laborategia')
      .replace(/Facultad de Medicina y Enfermería/i, 'Medikuntza eta Erizaintza Fakultatea');
  }
  return localized;
}

export function getThesisBadgeText(
  thesis: { data: { status: 'ongoing' | 'completed'; badge?: string; year?: string | number }; locale?: Locale },
  lang: Locale = DEFAULT_LOCALE
): string {
  const t = getTranslations(lang);
  const isOngoing = thesis.data.status === 'ongoing';

  // If the thesis itself is authored in the requested language and has a badge, use it
  if (thesis.locale === lang && thesis.data.badge) {
    return thesis.data.badge;
  }

  if (isOngoing) {
    return t.theses_badge_ongoing || t.theses_ongoing || 'En Curso';
  }

  const base = t.theses_badge_completed || (lang === 'eu' ? 'Defendatua' : lang === 'en' ? 'Completed' : 'Defendida');
  return thesis.data.year ? `${base} (${thesis.data.year})` : base;
}

export function localizeThesisProgram(program: string = '', lang: Locale = DEFAULT_LOCALE): string {
  if (!program) {
    if (lang === 'eu') return 'Biomedikuntzako Doktorego Programa (UPV/EHU)';
    if (lang === 'en') return 'PhD Program in Biomedicine (UPV/EHU)';
    return 'Programa de Doctorado en Biomedicina (UPV/EHU)';
  }
  if (lang === 'es') return program;

  let localized = program;
  if (lang === 'en') {
    localized = localized
      .replace(/Programa de Doctorado en Biomedicina/i, 'PhD Program in Biomedicine')
      .replace(/Programa de Doctorado en Biología Molecular y Biomedicina/i, 'PhD Program in Molecular Biology and Biomedicine');
  } else if (lang === 'eu') {
    localized = localized
      .replace(/Programa de Doctorado en Biomedicina/i, 'Biomedikuntzako Doktorego Programa')
      .replace(/Programa de Doctorado en Biología Molecular y Biomedicina/i, 'Biologia Molekularra eta Biomedikuntza Doktorego Programa');
  }
  return localized;
}

