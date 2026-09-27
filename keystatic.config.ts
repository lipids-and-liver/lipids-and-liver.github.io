import { config, fields, collection } from '@keystatic/core';

function createThesesCollection(lang: 'es' | 'eu' | 'en', label: string) {
  return collection({
    label,
    slugField: 'slug',
    path: `src/content/theses/${lang}/*`,
    format: { contentField: 'content' },
    schema: {
      slug: fields.slug({ name: { label: 'Identificador / Slug (ej. tesis-1)' } }),
      title: fields.text({ label: 'Título de la Tesis' }),
      author: fields.text({ label: 'Doctorando / Autor' }),
      status: fields.select({
        label: 'Estado',
        options: [
          { label: 'En curso / Ongoing', value: 'ongoing' },
          { label: 'Defendida / Completed', value: 'completed' },
        ],
        defaultValue: 'ongoing',
      }),
      institution: fields.text({ label: 'Institución', defaultValue: 'UPV/EHU' }),
      year: fields.text({ label: 'Año o Periodo (ej. 2024 o 2023-2026)' }),
      badge: fields.text({ label: 'Distintivo / Badge (ej. En Curso, Cum Laude)' }),
      directors: fields.array(fields.text({ label: 'Director/a' }), {
        label: 'Dirección de Tesis',
        itemLabel: props => props.value,
      }),
      program: fields.text({ label: 'Programa de Doctorado' }),
      keywords: fields.array(fields.text({ label: 'Palabra clave' }), {
        label: 'Palabras Clave',
        itemLabel: props => props.value,
      }),
      order: fields.integer({ label: 'Orden de aparición', defaultValue: 99 }),
      content: fields.markdoc({ label: 'Resumen de la Tesis (Abstract)', extension: 'md' }),
    },
  });
}

function createTeamCollection(lang: 'es' | 'eu' | 'en', label: string) {
  return collection({
    label,
    slugField: 'slug',
    path: `src/content/team/${lang}/*`,
    format: { contentField: 'content' },
    schema: {
      slug: fields.slug({ name: { label: 'Identificador / Slug (ej. patricia-aspichueta)' } }),
      name: fields.text({ label: 'Nombre y Apellidos' }),
      role: fields.text({ label: 'Cargo o Puesto' }),
      category: fields.select({
        label: 'Categoría',
        options: [
          { label: 'PDI (Profesorado / Investigador)', value: 'PDI' },
          { label: 'Posdoctoral', value: 'Posdoctoral' },
          { label: 'Predoctoral', value: 'Predoctoral' },
          { label: 'Técnico / Apoyo', value: 'Técnico' },
        ],
        defaultValue: 'PDI',
      }),
      department: fields.text({ label: 'Departamento / Filiación' }),
      image: fields.text({ label: 'Ruta de la Foto', defaultValue: '/assets/images/team/placeholder.jpg' }),
      email: fields.text({ label: 'Correo Electrónico' }),
      office: fields.text({ label: 'Despacho / Laboratorio' }),
      orcid: fields.text({ label: 'Identificador ORCID' }),
      order: fields.integer({ label: 'Orden de aparición', defaultValue: 99 }),
      cv: fields.object(
        {
          title: fields.text({ label: 'Título del Perfil CV' }),
          researchSummary: fields.text({ label: 'Resumen de Investigación', multiline: true }),
          degrees: fields.array(fields.text({ label: 'Titulación' }), { label: 'Formación Académica' }),
          positions: fields.array(fields.text({ label: 'Puesto' }), { label: 'Puestos y Trayectoria' }),
          grants: fields.array(fields.text({ label: 'Proyecto' }), { label: 'Proyectos y Financiación' }),
          publications: fields.array(fields.text({ label: 'Publicación' }), { label: 'Publicaciones Destacadas' }),
          teaching: fields.array(fields.text({ label: 'Actividad docente' }), { label: 'Docencia Impartida' }),
        },
        { label: 'Currículum Vitae (CV Estructurado)' }
      ),
      content: fields.markdoc({ label: 'Biografía Detallada', extension: 'md' }),
    },
  });
}

function createResearchCollection(lang: 'es' | 'eu' | 'en', label: string) {
  return collection({
    label,
    slugField: 'slug',
    path: `src/content/research/${lang}/*`,
    format: { contentField: 'content' },
    schema: {
      slug: fields.slug({ name: { label: 'Identificador / Slug (ej. mafld)' } }),
      title: fields.text({ label: 'Título de la Línea' }),
      shortDesc: fields.text({ label: 'Descripción Breve (Tarjeta)', multiline: true }),
      badge: fields.text({ label: 'Distintivo / Etiqueta' }),
      image: fields.text({ label: 'Imagen de Cabecera (Ruta)' }),
      affiliation: fields.text({ label: 'Filiación / Entorno de Trabajo' }),
      order: fields.integer({ label: 'Orden de aparición', defaultValue: 99 }),
      content: fields.markdoc({ label: 'Memoria y Objetivos de la Línea', extension: 'md' }),
    },
  });
}

function createPublicationsCollection(lang: 'es' | 'eu' | 'en', label: string) {
  return collection({
    label,
    slugField: 'slug',
    path: `src/content/publications/${lang}/*`,
    format: { contentField: 'content' },
    schema: {
      slug: fields.slug({ name: { label: 'Identificador / Slug (ej. 2024-nature-comm)' } }),
      year: fields.text({ label: 'Año (ej. 2025)' }),
      title: fields.text({ label: 'Título del Artículo' }),
      authors: fields.text({ label: 'Autores' }),
      journal: fields.text({ label: 'Revista Científica / Journal' }),
      topic: fields.text({ label: 'Tema / Línea (ej. MAFLD, Cáncer, Spatial Omics)' }),
      doi: fields.text({ label: 'DOI (ej. 10.1038/s41467-024-12345-6)' }),
      content: fields.markdoc({ label: 'Abstract / Resumen', extension: 'md' }),
    },
  });
}

function createTrainingCollection(lang: 'es' | 'eu' | 'en', label: string) {
  return collection({
    label,
    slugField: 'slug',
    path: `src/content/training/${lang}/*`,
    format: { contentField: 'content' },
    schema: {
      slug: fields.slug({ name: { label: 'Identificador / Slug' } }),
      title: fields.text({ label: 'Título del Programa / Grado' }),
      type: fields.text({ label: 'Tipo (Grado, Máster, Doctorado)' }),
      badge: fields.text({ label: 'Distintivo' }),
      institution: fields.text({ label: 'Centro / Facultad' }),
      url: fields.text({ label: 'Enlace Oficial' }),
      icon: fields.text({ label: 'Icono FontAwesome (ej. fas fa-graduation-cap)' }),
      order: fields.integer({ label: 'Orden', defaultValue: 99 }),
      content: fields.markdoc({ label: 'Descripción del Programa', extension: 'md' }),
    },
  });
}

function createPresentationCollection(lang: 'es' | 'eu' | 'en', label: string) {
  return collection({
    label,
    slugField: 'slug',
    path: `src/content/presentation/${lang}/*`,
    format: { contentField: 'content' },
    schema: {
      slug: fields.slug({ name: { label: 'Identificador / Slug (ej. 1-perfil)' } }),
      tabTitle: fields.text({ label: 'Título de la Pestaña' }),
      tabId: fields.text({ label: 'ID de la Pestaña HTML (ej. tab-profile)' }),
      order: fields.integer({ label: 'Orden', defaultValue: 99 }),
      specialties: fields.array(fields.text({ label: 'Especialidad' }), {
        label: 'Especialidades / Áreas Clave',
      }),
      content: fields.markdoc({ label: 'Texto Institucional', extension: 'md' }),
    },
  });
}

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'Lipids & Liver (UPV/EHU)',
    },
    navigation: {
      'Contenido en Español': [
        'theses_es',
        'team_es',
        'research_es',
        'publications_es',
        'training_es',
        'presentation_es',
      ],
      'Edukiak Euskaraz': [
        'theses_eu',
        'team_eu',
        'research_eu',
        'publications_eu',
        'training_eu',
        'presentation_eu',
      ],
      'English Content': [
        'theses_en',
        'team_en',
        'research_en',
        'publications_en',
        'training_en',
        'presentation_en',
      ],
    },
  },
  collections: {
    // Español
    theses_es: createThesesCollection('es', 'Tesis Doctorales (ES)'),
    team_es: createTeamCollection('es', 'Personal y Equipo (ES)'),
    research_es: createResearchCollection('es', 'Líneas de Investigación (ES)'),
    publications_es: createPublicationsCollection('es', 'Publicaciones Científicas (ES)'),
    training_es: createTrainingCollection('es', 'Formación y Docencia (ES)'),
    presentation_es: createPresentationCollection('es', 'Presentación Institucional (ES)'),

    // Euskara
    theses_eu: createThesesCollection('eu', 'Doktorego Tesiak (EU)'),
    team_eu: createTeamCollection('eu', 'Pertsonala eta Taldea (EU)'),
    research_eu: createResearchCollection('eu', 'Ikerketa Lerroak (EU)'),
    publications_eu: createPublicationsCollection('eu', 'Argitalpen Zientifikoak (EU)'),
    training_eu: createTrainingCollection('eu', 'Prestakuntza eta Irakaskuntza (EU)'),
    presentation_eu: createPresentationCollection('eu', 'Erakunde Aurkezpena (EU)'),

    // English
    theses_en: createThesesCollection('en', 'PhD Theses (EN)'),
    team_en: createTeamCollection('en', 'Personnel & Team (EN)'),
    research_en: createResearchCollection('en', 'Research Lines (EN)'),
    publications_en: createPublicationsCollection('en', 'Scientific Publications (EN)'),
    training_en: createTrainingCollection('en', 'Academic Training (EN)'),
    presentation_en: createPresentationCollection('en', 'Institutional Presentation (EN)'),
  },
});
