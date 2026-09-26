import fs from 'fs';
import path from 'path';

global.window = {};
const dataCode = fs.readFileSync('assets/js/data.js', 'utf8');
eval(dataCode);
const APP_DATA = window.APP_DATA;

function escapeYaml(str) {
  if (typeof str !== 'string') return str;
  return JSON.stringify(str);
}

// 1. Save Theses
console.log('Migrating theses...');
const allTheses = [
  ...APP_DATA.theses.ongoing.map((t) => ({ ...t, statusNorm: 'ongoing' })),
  ...APP_DATA.theses.completed.map((t) => ({ ...t, statusNorm: 'completed' }))
];

allTheses.forEach((t, idx) => {
  const newId = `tesis-${idx + 1}`;
  const filename = path.join('src/content/theses', `${newId}.md`);
  const directorsList = Array.isArray(t.directors)
    ? t.directors
    : (t.directors ? t.directors.split(',').map(d => d.trim()) : []);

  const keywordsList = Array.isArray(t.keywords) ? t.keywords : [];

  const content = `---
id: ${escapeYaml(newId)}
author: ${escapeYaml(t.author)}
status: "${t.statusNorm}"
title: ${escapeYaml(t.title)}
institution: ${escapeYaml(t.institution || 'UPV/EHU')}
year: ${escapeYaml(String(t.year))}
badge: ${escapeYaml(t.badge || '')}
directors:
${directorsList.map(d => `  - ${escapeYaml(d)}`).join('\n')}
program: ${escapeYaml(t.program || '')}
keywords:
${keywordsList.map(k => `  - ${escapeYaml(k)}`).join('\n')}
order: ${idx + 1}
---

${t.abstract || ''}
`;
  fs.writeFileSync(filename, content.trim() + '\n', 'utf8');
});

// 2. Save Team Members
console.log('Migrating team members...');
APP_DATA.teamMembers.forEach((m, idx) => {
  const filename = path.join('src/content/team', `${m.id}.md`);
  const cv = m.cv || {};

  const cvDegrees = (cv.degrees || []).map(d => `      - ${escapeYaml(d)}`).join('\n');
  const cvPositions = (cv.positions || []).map(p => `      - ${escapeYaml(p)}`).join('\n');
  const cvGrants = (cv.grants || []).map(g => `      - ${escapeYaml(g)}`).join('\n');
  const cvPubs = (cv.publications || []).map(p => `      - ${escapeYaml(p)}`).join('\n');
  const cvTeaching = (cv.teaching || []).map(t => `      - ${escapeYaml(t)}`).join('\n');

  const imgPath = m.image ? (m.image.startsWith('/') ? m.image : `/${m.image}`) : '/assets/images/team/placeholder.jpg';

  const content = `---
id: ${escapeYaml(m.id)}
name: ${escapeYaml(m.name)}
role: ${escapeYaml(m.role)}
category: ${escapeYaml(m.category)}
department: ${escapeYaml(m.department || '')}
image: ${escapeYaml(imgPath)}
email: ${escapeYaml(m.email || '')}
office: ${escapeYaml(m.office || '')}
orcid: ${escapeYaml(m.orcid || '')}
order: ${idx + 1}
cv:
  title: ${escapeYaml(cv.title || m.role)}
  researchSummary: ${escapeYaml(cv.researchSummary || '')}
  degrees:
${cvDegrees || '    []'}
  positions:
${cvPositions || '    []'}
  grants:
${cvGrants || '    []'}
  publications:
${cvPubs || '    []'}
  teaching:
${cvTeaching || '    []'}
---

${m.bio || ''}
`;
  fs.writeFileSync(filename, content.trim() + '\n', 'utf8');
});

// 3. Save Research Lines
console.log('Migrating research lines...');
APP_DATA.researchLines.forEach((l, idx) => {
  const filename = path.join('src/content/research', `${l.id}.md`);
  const imgPath = l.image ? (l.image.startsWith('/') ? l.image : `/${l.image}`) : '';
  const content = `---
id: ${escapeYaml(l.id)}
title: ${escapeYaml(l.title)}
shortDesc: ${escapeYaml(l.shortDesc)}
image: ${escapeYaml(imgPath)}
badge: ${escapeYaml(l.badge)}
order: ${idx + 1}
---

${(l.details || '').trim()}
`;
  fs.writeFileSync(filename, content.trim() + '\n', 'utf8');
});

// 4. Save Publications
console.log('Migrating publications...');
APP_DATA.publications.forEach((p, idx) => {
  const filename = path.join('src/content/publications', `${p.id}.md`);
  const content = `---
id: ${escapeYaml(p.id)}
year: ${escapeYaml(String(p.year))}
title: ${escapeYaml(p.title)}
authors: ${escapeYaml(p.authors)}
journal: ${escapeYaml(p.journal)}
topic: ${escapeYaml(p.topic)}
doi: ${escapeYaml(p.doi || '')}
---

${p.abstract || ''}
`;
  fs.writeFileSync(filename, content.trim() + '\n', 'utf8');
});

// 5. Save Static Data & Dictionaries
console.log('Saving static datasets...');
fs.writeFileSync('src/data/stats.json', JSON.stringify(APP_DATA.stats, null, 2), 'utf8');
fs.writeFileSync('src/data/leadership.json', JSON.stringify(APP_DATA.leadership, null, 2), 'utf8');
fs.writeFileSync('src/data/trainings.json', JSON.stringify(APP_DATA.trainings, null, 2), 'utf8');
fs.writeFileSync('src/data/translations.json', JSON.stringify(APP_DATA.translations, null, 2), 'utf8');

// 6. Create Templates
console.log('Creating template guides...');
const thesisTemplate = `---
# INSTRUCCIONES:
# Rellena los datos entre comillas.
# status: "ongoing" (si está en curso) o "completed" (si ya ha sido defendida).
author: "Nombre y Apellidos del Doctorando"
status: "ongoing"
title: "Título completo de la Tesis Doctoral"
institution: "UPV/EHU - Departamento de Fisiología"
year: "2024-2027"
badge: "En Curso"
directors:
  - "Dra. Patricia Aspichueta Celaá"
  - "Dr. Nombre Co-director"
program: "Programa de Doctorado en Biomedicina"
keywords:
  - "Metabolismo Lipídico"
  - "Hepatología"
---

Escribe aquí el resumen (abstract) de la tesis doctoral en uno o varios párrafos.
Puedes usar negrita (**texto**) o cursiva (*texto*) si lo necesitas.
`;
fs.writeFileSync('src/content/templates/_plantilla_tesis.md', thesisTemplate.trim() + '\n', 'utf8');

const teamTemplate = `---
# INSTRUCCIONES:
# Rellena los datos del nuevo miembro del equipo.
# category puede ser: Coordinadora, Directora de Línea, Investigador Senior, PDI, Postdoctoral, Predoctoral, Técnico.
name: "Dra./Dr. Nombre y Apellidos"
role: "Puesto o Rol (ej: Investigador Predoctoral)"
category: "Predoctoral"
department: "Departamento de Fisiología, Facultad de Medicina y Enfermería"
image: "/assets/images/team/placeholder.jpg"
email: "nombre.apellido@ehu.eus"
office: "Despacho, Facultad de Medicina y Enfermería, Leioa"
orcid: "0000-0000-0000-0000"
order: 99
cv:
  title: "Puesto o Título Académico"
  researchSummary: "Breve resumen de las líneas de investigación en las que participa."
  degrees:
    - "Grado en Bioquímica y Biología Molecular (UPV/EHU, 2022)"
    - "Máster en Biomedicina (UPV/EHU, 2023)"
  positions:
    - "Investigador Predoctoral FPI (2024 - Presente)"
  grants:
    - "Beca Predoctoral del Gobierno Vasco (2024-2028)"
  publications:
    - "Primer autor/a en artículo científico..."
  teaching:
    - "Prácticas de laboratorio de Fisiología Humana"
---

Escribe aquí una breve biografía profesional (1 o 2 párrafos) del investigador/a.
`;
fs.writeFileSync('src/content/templates/_plantilla_miembro.md', teamTemplate.trim() + '\n', 'utf8');

const pubTemplate = `---
# INSTRUCCIONES:
# Rellena los datos de la publicación científica.
# topic: "mafld", "cancer", "lipidomics", "e2f", o "exposome".
year: "2025"
title: "Título oficial del artículo publicado"
authors: "Apellidos A, Apellidos B, Aspichueta P, et al."
journal: "Nombre de la Revista (ej: Journal of Hepatology)"
topic: "mafld"
doi: "10.1016/j.jhep.2025.xx.xxx"
---

Pega aquí el abstract oficial del artículo publicado.
`;
fs.writeFileSync('src/content/templates/_plantilla_publicacion.md', pubTemplate.trim() + '\n', 'utf8');

console.log('Migration completed successfully!');
