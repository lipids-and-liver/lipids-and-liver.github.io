import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// El CMS guarda '' cuando un desplegable opcional se deja sin elegir: se trata como ausente
const translationStatus = z.preprocess(val => val || undefined, z.enum(['draft', 'reviewed']).optional());

const theses = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/theses" }),
  schema: z.object({
    id: z.string().optional(),
    author: z.string().default('Doctorando/a'),
    status: z.enum(['ongoing', 'completed']).default('ongoing'),
    title: z.string().default('Tesis Doctoral'),
    institution: z.string().nullish().transform(val => val || 'UPV/EHU'),
    year: z.union([z.string(), z.number()]),
    badge: z.string().nullish(),
    directors: z.array(z.string()).nullish().transform(val => val || []),
    program: z.string().nullish(),
    keywords: z.array(z.string()).nullish().transform(val => val || []),
    // Línea de investigación (id de src/content/research): su imagen aparece en la tarjeta de la tesis
    researchLine: z.string().nullish(),
    defenseDate: z.string().nullish(),
    officialUrl: z.string().nullish(),
    handleUrl: z.string().nullish(),
    dialnetUrl: z.string().nullish(),
    teseoId: z.string().nullish(),
    department: z.string().nullish(),
    university: z.string().nullish(),
    order: z.union([z.number(), z.string()]).nullish().transform(val => (val !== null && val !== undefined && val !== '') ? Number(val) : 99)
  })
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({
    // Traducción en borrador pendiente de revisión por el grupo (ver npm run i18n:check)
    translationStatus,
    id: z.string().optional(),
    name: z.string().default('Investigador/a'),
    role: z.string().default('Investigador/a'),
    category: z.string().default('Predoctoral'),
    department: z.string().nullish().transform(val => val || 'Departamento de Fisiología, Facultad de Medicina y Enfermería'),
    image: z.string().nullish().transform(val => val || '/assets/images/team/placeholder.jpg'),
    email: z.string().nullish().transform(val => val || ''),
    phone: z.string().nullish().transform(val => val || ''),
    office: z.string().nullish().transform(val => val || ''),
    orcid: z.string().nullish().transform(val => val || ''),
    // Formas exactas en que firma en las publicaciones, si el reconocimiento automático por nombre falla
    publicationNames: z.array(z.string()).nullish().transform(val => val || []),
    twitter: z.string().nullish(),
    x: z.string().nullish(),
    linkedin: z.string().nullish(),
    github: z.string().nullish(),
    quote: z.union([z.string(), z.array(z.string())]).nullish(),
    order: z.union([z.number(), z.string()]).nullish().transform(val => (val !== null && val !== undefined && val !== '') ? Number(val) : 99),
    cv: z.object({
      title: z.string().nullish(),
      degrees: z.array(z.string()).nullish().transform(val => val || []),
      otherTraining: z.array(z.string()).nullish().transform(val => val || []),
      positions: z.array(z.string()).nullish().transform(val => val || []),
      grants: z.array(z.string()).nullish().transform(val => val || []),
      conferences: z.array(z.string()).nullish().transform(val => val || []),
      languages: z.array(z.string()).nullish().transform(val => val || []),
      patents: z.array(z.string()).nullish().transform(val => val || []),
      teaching: z.array(z.string()).nullish().transform(val => val || [])
    }).nullish()
  })
});

const research = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/research" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string().default('Línea de Investigación'),
    shortDesc: z.string().default(''),
    image: z.string().nullish().transform(val => val || '/assets/images/mafld.jpg'),
    badge: z.string().default('Línea Prioritaria'),
    order: z.union([z.number(), z.string()]).nullish().transform(val => (val !== null && val !== undefined && val !== '') ? Number(val) : 99),
    affiliation: z.string().nullish(),
    // Traducción en borrador pendiente de revisión por el grupo (ver npm run i18n:check)
    translationStatus,
  })
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    id: z.string().optional(),
    year: z.union([z.string(), z.number()]),
    title: z.string(),
    authors: z.string(),
    journal: z.string(),
    topic: z.string(),
    // Clave única de cada publicación (el nombre del fichero sale del DOI)
    doi: z.string().nullish(),
    pmid: z.union([z.string(), z.number()]).nullish().transform(val => (val === null || val === undefined || val === '') ? null : String(val)),
    type: z.enum(['article', 'review']).nullish(),
  })
});

const presentation = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/presentation" }),
  schema: z.object({
    id: z.string().optional(),
    tabTitle: z.string(),
    tabId: z.string(),
    order: z.union([z.number(), z.string()]).nullish().transform(val => (val !== null && val !== undefined && val !== '') ? Number(val) : 99),
    specialties: z.array(z.string()).nullish().transform(val => val || []),
    staffCompositionTitle: z.string().nullish(),
    staffComposition: z.array(
      z.object({
        count: z.string(),
        role: z.string()
      })
    ).nullish()
  })
});

const training = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/training" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    type: z.string(),
    badge: z.string().nullish(),
    institution: z.string().nullish(),
    url: z.string().nullish(),
    order: z.union([z.number(), z.string()]).nullish().transform(val => (val !== null && val !== undefined && val !== '') ? Number(val) : 99),
    icon: z.string().nullish(),
    bentoSpan: z.enum(['wide', 'compact', 'full']).nullish().transform(val => val || 'compact')
  })
});

// Categorías de noticias (clave estable; la etiqueta se traduce con news_cat_<clave>).
// Textos antiguos o desconocidos se normalizan; lo que no encaja va a "otros".
// Sin categoría de divulgación: esas actividades van al registro de src/content/outreach
const NEWS_CATEGORIES = ['congresos', 'publicaciones', 'premios', 'institucional', 'tesis', 'otros'] as const;
const NEWS_CATEGORY_ALIASES: Record<string, (typeof NEWS_CATEGORIES)[number]> = { acreditacion: 'institucional', divulgacion: 'otros' };
const normalizeNewsCategory = (val: string) => {
  const key = val.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  if ((NEWS_CATEGORIES as readonly string[]).includes(key)) return key as (typeof NEWS_CATEGORIES)[number];
  return NEWS_CATEGORY_ALIASES[key] ?? 'otros';
};

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string().default('Noticia'),
    date: z.union([z.string(), z.date()]).transform(val => val instanceof Date ? val.toISOString().split('T')[0] : String(val)),
    category: z.string().default('otros').transform(normalizeNewsCategory),
    categoryBadge: z.string().nullish(),
    summary: z.string().default(''),
    image: z.string().nullish(),
    author: z.string().nullish(),
    link: z.string().nullish(),
    // 'year' cuando solo se conoce el año (p. ej. noticias antiguas basadas en registros)
    datePrecision: z.enum(['day', 'year']).default('day'),
    featured: z.boolean().nullish().transform(val => Boolean(val)),
    order: z.union([z.number(), z.string()]).nullish().transform(val => (val !== null && val !== undefined && val !== '') ? Number(val) : 99),
    // Aviso en redes sociales (lo usa el feed RSS /portal/noticias/rss.xml). Opcional.
    social: z.object({
      enabled: z.boolean().nullish().transform(val => val !== false), // false = no anunciar
      text: z.string().nullish(),                                     // texto propio; vacío = resumen
      hashtags: z.array(z.string()).nullish().transform(val => val || []),
    }).nullish().transform(val => val ?? { enabled: true, text: null, hashtags: [] as string[] }),
  })
});

const letter = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/letter" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    badge: z.string(),
    salutation: z.string(),
    piName: z.string(),
    piRole: z.string(),
    piDept: z.string(),
    piBadgeOverlay: z.string().optional().default('IP & Coordinadora'),
    piImage: z.string().optional().default('/assets/images/team/patricia-aspichueta/image.jpg'),
    signRole: z.string().optional(),
    signDept: z.string().optional(),
    viewCvText: z.string().optional().default('Ver Curriculum Vitae Completo'),
    cvLink: z.string().optional().default('/curriculum/patricia-aspichueta'),
    email: z.string().optional().default('patricia.aspichueta@ehu.eus'),
    orcid: z.string().optional().default('0000-0002-3553-1755')
  })
});

// Recursos científicos: servicios y plataformas que usa el grupo (SGIker, Biobizkaia…)
const sciresources = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sciresources" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    provider: z.enum(['sgiker', 'biobizkaia']),
    icon: z.string().default('fas fa-flask'),
    location: z.string().nullish(),
    url: z.string().url(),
    // Foto del servicio (opcional); sin ella la ficha muestra solo el icono
    image: z.string().nullish(),
    imageAlt: z.string().nullish(),
    // Tamaño en el mosaico (bento): destacada 2×2, ancha 2×1 o normal
    size: z.enum(['normal', 'wide', 'featured']).nullish().transform(v => v ?? 'normal'),
    order: z.union([z.number(), z.string()]).nullish().transform(val => (val !== null && val !== undefined && val !== '') ? Number(val) : 99),
    // Texto redactado a partir de fuentes públicas, pendiente de validación por el grupo
    draft: z.boolean().default(false),
    translationStatus,
  })
});

// Registro de actividades de divulgación (radio, prensa, charlas, jornadas…).
// Una entrada por actividad, aunque no tenga noticia; si la tiene, se enlaza con `news`
// (slug de src/content/news) en vez de repetir el texto.
const OUTREACH_TYPES = ['radio-tv', 'prensa', 'charla', 'jornada', 'educacion', 'pacientes'] as const;

const outreach = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/outreach" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    date: z.union([z.string(), z.date()]).transform(val => val instanceof Date ? val.toISOString().split('T')[0] : String(val)),
    // 'year' cuando solo se conoce el año (o el curso)
    datePrecision: z.enum(['day', 'year']).default('day'),
    type: z.enum(OUTREACH_TYPES),
    // Idioma en que se hizo o publicó la actividad: sus textos no se traducen
    lang: z.enum(['es', 'eu', 'en']).default('es'),
    // Medio, evento u organizador (Onda Vasca, Congreso de los Diputados, Jakiunde…)
    venue: z.string(),
    location: z.string().nullish(),
    people: z.array(z.string()).nullish().transform(val => val || []),
    summary: z.string().nullish(),
    url: z.string().nullish(),
    // Grabación o texto que se puede consultar: aparece en «Escucha, mira, lee»
    resource: z.object({
      kind: z.enum(['video', 'audio', 'texto']),
      url: z.string().url()
    }).nullish(),
    // Slug de la noticia relacionada en src/content/news
    news: z.string().nullish(),
    // Imagen ilustrativa (opcional) y sus créditos, obligatorios si la licencia los exige (CC BY, CC BY-SA…)
    image: z.string().nullish(),
    imageCredit: z.object({
      author: z.string(),
      license: z.string(),
      licenseUrl: z.string().url().nullish(),
      source: z.string().url().nullish()
    }).nullish(),
    // Dato sin fuente que lo confirme: se muestra marcado hasta que el grupo lo valide
    draft: z.boolean().default(false)
  })
});

export const collections = {
  outreach,
  sciresources,
  theses,
  team,
  research,
  publications,
  presentation,
  training,
  news,
  letter
};


