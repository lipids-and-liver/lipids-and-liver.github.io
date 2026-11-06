// Genera src/data/alumni_map.json: siluetas de países (Natural Earth 1:50m, dominio público)
// proyectadas en equirectangular corregida, recortadas a Norteamérica-Atlántico-Europa occidental.
// Uso: descargar countries-50m.json de world-atlas@2.0.2 y ejecutar
//   node scripts/generar_mapa_alumni.mjs countries-50m.json src/data/alumni_map.json
// Solo hace falta volver a generarlo si cambia el encuadre (projection).
import { readFileSync, writeFileSync } from 'node:fs';
const [src, out] = process.argv.slice(2);
const topo = JSON.parse(readFileSync(src, 'utf8'));
const P = { lonMin: -100, lonMax: 14, latMin: 26, latMax: 61, k: 10, phi0: 45 };
const cos0 = Math.cos(P.phi0 * Math.PI / 180);
const W = (P.lonMax - P.lonMin) * cos0 * P.k, H = (P.latMax - P.latMin) * P.k;
const proj = ([lon, lat]) => [(lon - P.lonMin) * cos0 * P.k, (P.latMax - lat) * P.k];
const { scale, translate } = topo.transform;
const arcs = topo.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * scale[0] + translate[0], y * scale[1] + translate[1]]; }); });
const arc = i => i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
const ring = idx => idx.flatMap((i, n) => (n ? arc(i).slice(1) : arc(i)));
const M = 3; // margen en unidades
let d = '';
for (const g of topo.objects.countries.geometries) {
  const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
  for (const poly of polys) {
    const clamp = ([x, y]) => [Math.min(Math.max(x, -M), W + M), Math.min(Math.max(y, -M), H + M)];
    const rings = poly.map(r => ring(r).map(proj));
    const outer = rings[0];
    const xs = outer.map(p => p[0]), ys = outer.map(p => p[1]);
    if (Math.max(...xs) < -M || Math.min(...xs) > W + M || Math.max(...ys) < -M || Math.min(...ys) > H + M) continue;
    for (const r of rings) {
      const pts = [];
      for (const p0 of r) { const p = clamp(p0); const l = pts[pts.length - 1]; if (!l || Math.hypot(p[0] - l[0], p[1] - l[1]) > 1.5) pts.push(p); }
      if (pts.length < 4) continue;
      const bw = Math.max(...pts.map(p => p[0])) - Math.min(...pts.map(p => p[0]));
      const bh = Math.max(...pts.map(p => p[1])) - Math.min(...pts.map(p => p[1]));
      if ((bw < 4 && bh < 4) || bw < 0.5 || bh < 0.5) continue; // islotes invisibles
      d += 'M' + pts.map(p => `${Math.round(p[0])} ${Math.round(p[1])}`).join('L') + 'Z';
    }
  }
}
writeFileSync(out, JSON.stringify({ source: 'Natural Earth 1:50m (dominio público) vía world-atlas@2.0.2', projection: P, width: +W.toFixed(1), height: H, path: d }) + '\n');
console.log('W', W.toFixed(1), 'H', H, 'bytes', d.length);
