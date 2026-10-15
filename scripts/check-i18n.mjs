#!/usr/bin/env node
// Informe de traducciones del núcleo fijo (política de idiomas, oct. 2026).
// El núcleo debe existir en ES, EU y EN; el resto del contenido puede estar en 1 o 2 idiomas.
//
// Uso:  npm run i18n:check            -> informe (siempre termina con éxito)
//       npm run i18n:check -- --strict -> termina con error si falta algo del núcleo (útil en CI)

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const LOCALES = ['en', 'es', 'eu'];
// Colecciones del núcleo fijo, con carpeta por idioma en src/content/<colección>/<idioma>/
const CORE_COLLECTIONS = {
  letter: 'Carta de la IP',
  presentation: 'Presentación institucional',
  training: 'Docencia',
  research: 'Líneas de investigación',
  team: 'Fichas del equipo',
};
// Datos con campos por idioma (<campo>_es, <campo>_eu, <campo>_en)
const CORE_DATA = { 'stats.json': 'stats', 'hero_gallery.json': 'slides' };

const strict = process.argv.includes('--strict');
let missingTotal = 0;
const line = (s = '') => console.log(s);

line('Traducciones del núcleo fijo (ES · EU · EN)\n');

// 1) Textos de la interfaz: mismas claves en los tres idiomas y sin valores vacíos
const ui = JSON.parse(readFileSync(join(ROOT, 'src/data/translations.json'), 'utf8'));
const allKeys = new Set(LOCALES.flatMap(l => Object.keys(ui[l] || {})));
const uiMissing = LOCALES.flatMap(l => [...allKeys].filter(k => !ui[l]?.[k]?.toString().trim()).map(k => `${l}: ${k}`));
line(`Interfaz (translations.json): ${allKeys.size} textos`);
uiMissing.forEach(m => line(`  ✗ falta ${m}`));
if (!uiMissing.length) line('  ✓ completa');
missingTotal += uiMissing.length;

// 2) Colecciones del núcleo: cada elemento debe existir en los tres idiomas
for (const [collection, label] of Object.entries(CORE_COLLECTIONS)) {
  const dir = join(ROOT, 'src/content', collection);
  const byLocale = Object.fromEntries(LOCALES.map(l => {
    const d = join(dir, l);
    return [l, new Set(existsSync(d) ? readdirSync(d).filter(f => f.endsWith('.md')).map(f => basename(f, '.md')) : [])];
  }));
  const slugs = [...new Set(LOCALES.flatMap(l => [...byLocale[l]]))].sort();
  const gaps = slugs.map(s => [s, LOCALES.filter(l => !byLocale[l].has(s))]).filter(([, m]) => m.length);
  line(`\n${label} (${collection}): ${slugs.length} elementos, ${slugs.length - gaps.length} completos`);
  gaps.forEach(([s, m]) => line(`  ✗ ${s}: falta ${m.join(', ').toUpperCase()}`));
  if (!gaps.length) line('  ✓ completa');
  missingTotal += gaps.reduce((n, [, m]) => n + m.length, 0);
}

// 3) Datos con campos por idioma
for (const [file, listKey] of Object.entries(CORE_DATA)) {
  const raw = JSON.parse(readFileSync(join(ROOT, 'src/data', file), 'utf8'));
  const items = raw[listKey] || [];
  const fields = [...new Set(items.flatMap(it => Object.keys(it).filter(k => /_(es|eu|en)$/.test(k)).map(k => k.slice(0, -3))))];
  const gaps = items.flatMap((it, i) => fields.flatMap(f => LOCALES.filter(l => !it[`${f}_${l}`]?.toString().trim()).map(l => `#${i + 1} ${f}_${l}`)));
  line(`\nDatos ${file}: ${items.length} elementos`);
  gaps.forEach(g => line(`  ✗ falta ${g}`));
  if (!gaps.length) line('  ✓ completos');
  missingTotal += gaps.length;
}

line(`\n${missingTotal ? `Faltan ${missingTotal} traducciones del núcleo.` : 'El núcleo fijo está completo en los tres idiomas.'}`);
line('Mientras falten, la web muestra el contenido en el idioma disponible con un aviso.');
if (strict && missingTotal) process.exit(1);
