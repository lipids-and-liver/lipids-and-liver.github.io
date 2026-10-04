import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const theses = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/theses" }),
  schema: z.object({
    id: z.string().optional(),
    author: z.string().default('Doctorando/a'),
    status: z.enum(['ongoing', 'completed']).default('ongoing'),
    title: z.string().default('Tesis Doctoral'),
    institution: z.string().nullish().transform(val => val || 'UPV/EHU'),
    year: z.union([z.string(), z.number()]).default(new Date().getFullYear()),
    badge: z.string().nullish(),
    directors: z.array(z.string()).nullish().transform(val => val || []),
    program: z.string().nullish(),
    keywords: z.array(z.string()).nullish().transform(val => val || []),
    order: z.union([z.number(), z.string()]).nullish().transform(val => (val !== null && val !== undefined && val !== '') ? Number(val) : 99)
  })
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({
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
      publications: z.array(z.string()).nullish().transform(val => val || []),
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
    affiliation: z.string().nullish()
  })
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    id: z.string().optional(),
    year: z.union([z.string(), z.number()]).default(new Date().getFullYear()),
    title: z.string(),
    authors: z.string(),
    journal: z.string(),
    topic: z.string(),
    doi: z.string().nullish()
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

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string().default('Proyecto de Investigación'),
    code: z.string().default(''),
    fundingBody: z.string().default(''),
    fundingType: z.enum(['regional', 'national', 'european', 'foundation']).nullish().transform(val => val || 'national'),
    pi: z.string().default('Dra. Patricia Aspichueta'),
    period: z.string().default(''),
    status: z.enum(['active', 'completed']).nullish().transform(val => val || 'active'),
    budget: z.string().nullish(),
    badge: z.string().nullish(),
    summary: z.string().nullish(),
    order: z.union([z.number(), z.string()]).nullish().transform(val => (val !== null && val !== undefined && val !== '') ? Number(val) : 99)
  })
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string().default('Noticia'),
    date: z.union([z.string(), z.date()]).nullish().transform(val => val instanceof Date ? val.toISOString().split('T')[0] : (val ? String(val) : new Date().toISOString().split('T')[0])),
    category: z.string().default('Novedades'),
    categoryBadge: z.string().nullish(),
    summary: z.string().default(''),
    image: z.string().nullish(),
    author: z.string().nullish(),
    link: z.string().nullish(),
    featured: z.boolean().nullish().transform(val => Boolean(val)),
    order: z.union([z.number(), z.string()]).nullish().transform(val => (val !== null && val !== undefined && val !== '') ? Number(val) : 99)
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
    orcid: z.string().optional().default('0000-0002-8921-9421')
  })
});

export const collections = {
  theses,
  team,
  research,
  publications,
  presentation,
  training,
  projects,
  news,
  letter
};


