#!/usr/bin/env python3
"""
Actualiza desde su CVN en línea (FECYT) las fichas de todos los miembros que tienen el
campo `cvn` (su ORCID o la URL del CVN en línea), con scripts/importar_cvn.py --biografia.

Escribe un informe en Markdown (cambios por miembro y avisos) que el flujo de GitHub
Actions .github/workflows/cvn.yml usa como descripción del pull request.

Uso:
  python3 scripts/sincronizar_cvn.py                       # todas las fichas con `cvn`
  python3 scripts/sincronizar_cvn.py --informe informe.md
  python3 scripts/sincronizar_cvn.py --miembro jose-antonio-lopez
"""

import argparse
import difflib
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import importar_cvn  # noqa: E402

ORCID_RE = re.compile(r'\d{4}-\d{4}-\d{4}-\d{3}[\dX]')
MAX_DIFF_CHARS = 12000  # GitHub limita la descripción de un PR a 65 536 caracteres


def cvn_orcid(path: Path):
    """ORCID del campo `cvn` de la ficha; None si no tiene, '' si no es válido."""
    m = re.search(r'^cvn:[ \t]*(.*)$', path.read_text(encoding='utf-8').split('\n---', 1)[0], re.M)
    if not m or not m.group(1).strip(' \'"'):
        return None
    found = ORCID_RE.search(m.group(1))
    return found.group(0) if found else ''


def sync_member(path: Path, orcid: str):
    """Devuelve (estado, avisos, diff)."""
    before = path.read_text(encoding='utf-8')
    args = importar_cvn.build_parser().parse_args(['--orcid', orcid, '--fichero', str(path), '--biografia'])
    try:
        warnings = importar_cvn.import_member(args, path)
    except SystemExit as e:
        path.write_text(before, encoding='utf-8')
        return 'error', [str(e)], ''
    except Exception as e:  # red caída, XML inesperado…: no debe parar al resto
        path.write_text(before, encoding='utf-8')
        return 'error', [f'{type(e).__name__}: {e}'], ''
    after = path.read_text(encoding='utf-8')
    if after == before:
        return 'sin cambios', warnings, ''
    rel = path.relative_to(importar_cvn.REPO)
    diff = ''.join(difflib.unified_diff(before.splitlines(True), after.splitlines(True),
                                        f'a/{rel}', f'b/{rel}', n=1))
    return 'actualizada', warnings, diff


def report(results):
    lines = ['## Actualización de perfiles desde el CVN', '',
             'Cambios que trae el CVN en línea (FECYT) de cada miembro con el campo `cvn`.', '',
             '| Miembro | Resultado | Avisos |', '|---|---|---|']
    for member, (state, warnings, _) in results.items():
        lines.append(f'| {member} | {state} | {"<br>".join(warnings) or "—"} |')
    budget = MAX_DIFF_CHARS
    for member, (state, _, diff) in results.items():
        if not diff:
            continue
        if len(diff) > budget:
            diff = diff[:max(budget, 0)] + '\n… (cambio recortado: míralo en la pestaña «Files changed»)\n'
        budget -= len(diff)
        lines += ['', f'<details><summary>Cambios en <b>{member}</b></summary>', '', '```diff', diff.rstrip(), '```', '', '</details>']
    lines += ['', '### Antes de fusionar',
              '- Revisa erratas y textos cortados que vengan del CVN.',
              '- Para corregirlos sin esperar a que el miembro edite su CVN, añade un reemplazo en '
              '`scripts/cvn_correcciones.json` y vuelve a lanzar el flujo (o corrígelo en este PR).',
              '- Para que un miembro conserve su biografía de la web, pon `"biografia": false` en ese fichero.']
    return '\n'.join(lines) + '\n'


def main():
    p = argparse.ArgumentParser(description='Actualiza desde el CVN en línea las fichas con el campo `cvn`.')
    p.add_argument('--miembro', action='append', help='solo este miembro (se puede repetir)')
    p.add_argument('--informe', help='fichero donde escribir el informe en Markdown')
    args = p.parse_args()

    results = {}
    for path in sorted(importar_cvn.TEAM_DIR.glob('*.md')):
        if args.miembro and path.stem not in args.miembro:
            continue
        orcid = cvn_orcid(path)
        if orcid is None:
            continue
        if not orcid:
            results[path.stem] = ('error', ['el campo `cvn` no contiene un ORCID válido'], '')
            continue
        print(f'== {path.stem} ({orcid})', file=sys.stderr)
        results[path.stem] = sync_member(path, orcid)

    if not results:
        print('Ninguna ficha tiene el campo `cvn`.', file=sys.stderr)
    for member, (state, warnings, _) in results.items():
        print(f'{member}: {state}' + ''.join(f'\n  aviso: {w}' for w in warnings))
    if args.informe:
        Path(args.informe).write_text(report(results), encoding='utf-8')


if __name__ == '__main__':
    main()
