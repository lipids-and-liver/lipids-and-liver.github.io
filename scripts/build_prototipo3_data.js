import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

function parseMdFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: content };
  }
  const data = yaml.load(match[1]) || {};
  const body = match[2] ? match[2].trim() : '';
  return { data, body };
}

function mdToHtml(md) {
  if (!md) return '';
  // Check if content already contains HTML tags
  if (md.includes('<p>') || md.includes('<div') || md.includes('<ul>')) {
    return md;
  }
  // Basic markdown to HTML
  let html = md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>');

  // Wrap lists
  html = html.replace(/(<li>[\s\S]*?<\/li>)/gm, '<ul>$1</ul>');
  // Deduplicate consecutive <ul>
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Wrap paragraphs
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<div')) return p;
    return `<p>${p}</p>`;
  }).filter(Boolean).join('\n');

  return html;
}

// 1. Stats & Leadership & Translations
const stats = JSON.parse(fs.readFileSync('src/data/stats.json', 'utf8'));
const leadership = JSON.parse(fs.readFileSync('src/data/leadership.json', 'utf8'));
const translations = JSON.parse(fs.readFileSync('src/data/translations.json', 'utf8'));

// 2. Presentation tabs
const presFiles = fs.readdirSync('src/content/presentation/es').filter(f => f.endsWith('.md')).sort();
const presentation = presFiles.map(file => {
  const { data, body } = parseMdFile(path.join('src/content/presentation/es', file));
  return {
    ...data,
    contentHtml: mdToHtml(body)
  };
}).sort((a, b) => (a.order || 99) - (b.order || 99));

// 3. Research Lines
const researchFiles = fs.readdirSync('src/content/research/es').filter(f => f.endsWith('.md')).sort();
const researchLines = researchFiles.map(file => {
  const { data, body } = parseMdFile(path.join('src/content/research/es', file));
  // Adjust image path if needed (ensure leading assets/)
  let img = data.image || '';
  if (img.startsWith('/')) img = img.substring(1);
  return {
    ...data,
    image: img,
    contentHtml: mdToHtml(body)
  };
}).sort((a, b) => (a.order || 99) - (b.order || 99));

// 4. Team Members
const teamFiles = fs.readdirSync('src/content/team/es').filter(f => f.endsWith('.md')).sort();
const teamMembers = teamFiles.map(file => {
  const { data, body } = parseMdFile(path.join('src/content/team/es', file));
  let img = data.image || 'assets/images/team/placeholder.jpg';
  if (img.startsWith('/')) img = img.substring(1);
  return {
    ...data,
    image: img,
    bio: body,
    bioHtml: mdToHtml(body)
  };
});

// Sort team members: Patricia first, then order
teamMembers.sort((a, b) => {
  if (a.id === 'patricia-aspichueta') return -1;
  if (b.id === 'patricia-aspichueta') return 1;
  return (a.order || 99) - (b.order || 99);
});

// 5. PhD Theses
const thesesFiles = fs.readdirSync('src/content/theses/es').filter(f => f.endsWith('.md')).sort();
const thesesList = thesesFiles.map(file => {
  const { data, body } = parseMdFile(path.join('src/content/theses/es', file));
  return {
    ...data,
    abstract: body,
    abstractHtml: mdToHtml(body)
  };
});

// Separate into ongoing and completed, sort according to rules: ongoing first, newest year first
function extractYear(val) {
  if (!val) return 0;
  const matches = String(val).match(/\d{4}/g);
  if (!matches) return 0;
  return Math.max(...matches.map(Number));
}

const ongoingTheses = thesesList
  .filter(t => t.status === 'ongoing')
  .sort((a, b) => extractYear(b.year) - extractYear(a.year) || (a.order || 0) - (b.order || 0));

const completedTheses = thesesList
  .filter(t => t.status === 'completed')
  .sort((a, b) => extractYear(b.year) - extractYear(a.year) || (a.order || 0) - (b.order || 0));

// 6. Publications
const pubFiles = fs.readdirSync('src/content/publications/es').filter(f => f.endsWith('.md')).sort();
const publications = pubFiles.map(file => {
  const { data, body } = parseMdFile(path.join('src/content/publications/es', file));
  return {
    ...data,
    abstract: body
  };
}).sort((a, b) => Number(b.year || 0) - Number(a.year || 0) || (a.order || 0) - (b.order || 0));

// 7. Training
const trainFiles = fs.readdirSync('src/content/training/es').filter(f => f.endsWith('.md')).sort();
const training = trainFiles.map(file => {
  const { data, body } = parseMdFile(path.join('src/content/training/es', file));
  return {
    ...data,
    contentHtml: mdToHtml(body)
  };
}).sort((a, b) => (a.order || 99) - (b.order || 99));

// Build final object
const APP_DATA = {
  stats,
  leadership,
  translations,
  presentation,
  researchLines,
  teamMembers,
  theses: {
    ongoing: ongoingTheses,
    completed: completedTheses,
    all: [...ongoingTheses, ...completedTheses]
  },
  publications,
  training
};

const outputContent = `/**
 * Lipids & Liver Research Group - Complete Structured Data & Multi-language Dictionary
 * Compiled with 100% of website content & structure for Prototipo 3 (Editorial Suizo)
 */

const APP_DATA = ${JSON.stringify(APP_DATA, null, 2)};

if (typeof window !== 'undefined') {
  window.APP_DATA = APP_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = APP_DATA;
}
`;

fs.writeFileSync('prototipos/prototipo3/assets/js/data.js', outputContent, 'utf8');
console.log(`Generated data.js successfully!`);
console.log(`- Team members: ${teamMembers.length}`);
console.log(`- Theses: ${thesesList.length} (Ongoing: ${ongoingTheses.length}, Completed: ${completedTheses.length})`);
console.log(`- Research lines: ${researchLines.length}`);
console.log(`- Publications: ${publications.length}`);
console.log(`- Training modules: ${training.length}`);
console.log(`- Presentation tabs: ${presentation.length}`);
