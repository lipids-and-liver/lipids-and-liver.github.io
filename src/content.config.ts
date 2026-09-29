import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const theses = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/theses" }),
  schema: z.object({
    id: z.string().optional(),
    author: z.string(),
    status: z.enum(['ongoing', 'completed']),
    title: z.string(),
    institution: z.string().default('UPV/EHU'),
    year: z.union([z.string(), z.number()]),
    badge: z.string().optional(),
    directors: z.array(z.string()).default([]),
    program: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    order: z.number().default(99)
  })
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({
    id: z.string().optional(),
    name: z.string(),
    role: z.string(),
    category: z.string(),
    department: z.string().optional(),
    image: z.string().nullable().optional().transform(val => val || '/assets/images/team/placeholder.jpg'),
    email: z.string().optional(),
    office: z.string().optional(),
    orcid: z.string().optional(),
    order: z.number().default(99),
    cv: z.object({
      title: z.string().optional(),
      researchSummary: z.string().optional(),
      degrees: z.array(z.string()).default([]),
      positions: z.array(z.string()).default([]),
      grants: z.array(z.string()).default([]),
      publications: z.array(z.string()).default([]),
      teaching: z.array(z.string()).default([])
    }).optional()
  })
});

const research = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/research" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    shortDesc: z.string(),
    image: z.string(),
    badge: z.string(),
    order: z.number().default(99),
    affiliation: z.string().optional()
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
    doi: z.string().optional()
  })
});

const presentation = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/presentation" }),
  schema: z.object({
    id: z.string().optional(),
    tabTitle: z.string(),
    tabId: z.string(),
    order: z.number().default(99),
    specialties: z.array(z.string()).optional(),
    staffCompositionTitle: z.string().optional(),
    staffComposition: z.array(
      z.object({
        count: z.string(),
        role: z.string()
      })
    ).optional()
  })
});

const training = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/training" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    type: z.string(),
    badge: z.string().optional(),
    institution: z.string().optional(),
    url: z.string().optional(),
    order: z.number().default(99),
    icon: z.string().optional(),
    bentoSpan: z.enum(['wide', 'compact', 'full']).optional().default('compact')
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    code: z.string(),
    fundingBody: z.string(),
    fundingType: z.enum(['regional', 'national', 'european', 'foundation']).default('national'),
    pi: z.string(),
    period: z.string(),
    status: z.enum(['active', 'completed']).default('active'),
    budget: z.string().optional(),
    badge: z.string().optional(),
    summary: z.string().optional(),
    order: z.number().default(99)
  })
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    date: z.union([z.string(), z.date()]).transform(val => val instanceof Date ? val.toISOString().split('T')[0] : String(val)),
    category: z.string(),
    categoryBadge: z.string().optional(),
    summary: z.string(),
    image: z.string().optional(),
    author: z.string().optional(),
    link: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99)
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
  news
};

