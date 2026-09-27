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
    image: z.string().default('/assets/images/team/placeholder.jpg'),
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
    agency: z.string(),
    category: z.enum(['ue', 'nacional', 'gobvasco', 'fundaciones']),
    code: z.string(),
    period: z.string(),
    budget: z.string(),
    ips: z.string(),
    badgeTag: z.string().optional(),
    highlightStyle: z.string().optional().default('card-highlight'),
    order: z.number().default(99)
  })
});

const transfer = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/transfer" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    type: z.enum(['patent', 'service']),
    badge: z.string().optional(),
    status: z.enum(['granted', 'pending', 'active']).optional(),
    statusLabel: z.string().optional(),
    reference: z.string().optional(),
    holder: z.string().optional(),
    inventors: z.string().optional(),
    order: z.number().default(99)
  })
});

const alumni = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/alumni" }),
  schema: z.object({
    id: z.string().optional(),
    name: z.string(),
    period: z.string(),
    thesisTitle: z.string(),
    destinationRole: z.string(),
    destinationOrg: z.string(),
    icon: z.string().optional().default('fas fa-user'),
    order: z.number().default(99)
  })
});

const opportunities = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/opportunities" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    type: z.enum(['tfm', 'predoc', 'postdoc', 'other']),
    badge: z.string(),
    badgeStyle: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    actionText: z.string().default('Solicitar Información'),
    order: z.number().default(99)
  })
});

const resources = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resources" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    type: z.enum(['dataset', 'protocol', 'software']),
    icon: z.string(),
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
      icon: z.string().optional()
    })).default([]),
    order: z.number().default(99)
  })
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    date: z.string(),
    category: z.string(),
    icon: z.string().default('fas fa-newspaper'),
    gradient: z.string().optional().default('linear-gradient(135deg, #002b49, #1e3a5f)'),
    source: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99)
  })
});

const outreach = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/outreach" }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    cardType: z.enum(['highlight', 'navy', 'cyan']).default('highlight'),
    icon: z.string(),
    badge: z.string().optional(),
    actionText: z.string().optional(),
    actionUrl: z.string().optional(),
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
  transfer,
  alumni,
  opportunities,
  resources,
  news,
  outreach
};
