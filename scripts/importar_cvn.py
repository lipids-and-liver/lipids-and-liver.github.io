#!/usr/bin/env python3
"""
Importa el currículum de un miembro del grupo desde su CVN (FECYT) a su ficha de la web.

El PDF de CVN lleva dentro los datos estructurados (clave /CVN-XML: un ZIP en base64 con
cv.xml). El script los extrae y reescribe el bloque `cv:` de la ficha en castellano
(src/content/team/es/<miembro>.md) con estos apartados:

  degrees       titulaciones y doctorado
  otherTraining cursos y formación especializada (los más recientes)
  positions     situación actual y cargos anteriores
  grants        proyectos competitivos (los más recientes; contratos con --incluir-contratos)
  publications  artículos, capítulos y libros (los más recientes)
  teaching      asignaturas impartidas y tesis doctorales dirigidas

`title`, `patents` y cualquier otro apartado de la ficha se conservan tal cual.
Los datos personales del CVN (DNI, teléfono, dirección…) no se leen nunca.

Uso:
  python3 scripts/importar_cvn.py CVN.pdf --miembro patricia-aspichueta
  python3 scripts/importar_cvn.py --orcid 0000-0002-8921-9421 --miembro patricia-aspichueta
  python3 scripts/importar_cvn.py CVN.pdf --mostrar        # solo muestra el resultado

IMPORTANTE: no guardes el PDF del CVN dentro del repositorio (la web es pública).
"""

import argparse
import base64
import io
import json
import re
import sys
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
TEAM_DIR = REPO / 'src' / 'content' / 'team' / 'es'
CVN_ONLINE = 'https://editor.cvn.fecyt.es/editor/cvnOnline/{orcid}'
MAX_XML_BYTES = 50 * 1024 * 1024

# Códigos CVNPK de los apartados que se importan (Norma CVN, FECYT)
POSITIONS_CURRENT = '010.010.000.000'
POSITIONS_PAST = '010.020.000.000'
DEGREES = '020.010.010.000'
DOCTORATE = '020.010.020.000'
SPECIALISED_TRAINING = '020.020.000.000'
COURSES = '020.050.000.000'
TEACHING = '030.010.000.000'
SUPERVISION = '030.040.000.000'
PROJECTS = '050.020.010.000'
CONTRACTS = '050.020.020.000'
PUBLICATIONS = '060.010.010.000'

SUPERVISION_PHD = '100'
PUBLICATION_TYPES = {'035': 'article', '148': 'chapter', '112': 'book'}

DOI_RE = re.compile(r'10\.\d{4,9}/[^\s"<>]+')


# ---------------------------------------------------------------------------
# Lectura del CVN
# ---------------------------------------------------------------------------

def xml_from_pdf(data: bytes) -> bytes:
    """Extrae cv.xml del PDF: valor de /CVN-XML = base64 de un ZIP."""
    m = re.search(rb'/CVN-XML\s*\(([A-Za-z0-9+/=\s\\]+)\)', data)
    if m:
        b64 = re.sub(rb'\\\r?\n|\s', b'', m.group(1))
    else:
        b64 = _cvn_xml_with_pypdf(data)
    if not b64:
        sys.exit('Error: el PDF no contiene datos CVN-XML. ¿Es un CVN generado por el editor de FECYT o una institución adaptada?')
    with zipfile.ZipFile(io.BytesIO(base64.b64decode(b64))) as z:
        name = next((n for n in z.namelist() if n.lower().endswith('.xml')), None)
        if not name:
            sys.exit('Error: los datos CVN-XML del PDF no contienen ningún XML.')
        if z.getinfo(name).file_size > MAX_XML_BYTES:
            sys.exit('Error: el XML del CVN es demasiado grande.')
        return z.read(name)


def _cvn_xml_with_pypdf(data: bytes):
    """Plan B por si el PDF guarda el diccionario comprimido (necesita pypdf)."""
    try:
        import pypdf
        from pypdf.generic import DictionaryObject, IndirectObject
    except ImportError:
        return None

    def find(obj, seen):
        if isinstance(obj, IndirectObject):
            if obj.idnum in seen:
                return None
            seen.add(obj.idnum)
            obj = obj.get_object()
        if isinstance(obj, DictionaryObject):
            if '/CVN-XML' in obj:
                return obj['/CVN-XML'].get_object()
            for k, v in obj.items():
                if k not in ('/Parent', '/Contents'):
                    r = find(v, seen)
                    if r is not None:
                        return r
        elif isinstance(obj, list):
            for v in obj:
                r = find(v, seen)
                if r is not None:
                    return r
        return None

    reader = pypdf.PdfReader(io.BytesIO(data))
    val = find(reader.trailer['/Root'], set())
    if val is None:
        return None
    return val.encode('latin-1') if isinstance(val, str) else bytes(val)


def load_cvn(source: str = None, orcid: str = None) -> ET.Element:
    if orcid:
        if not re.fullmatch(r'\d{4}-\d{4}-\d{4}-\d{3}[\dX]', orcid):
            sys.exit(f'Error: ORCID no válido: {orcid}')
        req = urllib.request.Request(CVN_ONLINE.format(orcid=orcid), headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=60).read()
        if not data.startswith(b'%PDF'):
            sys.exit(f'Error: no hay ningún CVN publicado en línea para el ORCID {orcid}. '
                     'Descarga el PDF desde el editor CVN y pásalo como fichero.')
    else:
        data = Path(source).read_bytes()
    xml = data if data.lstrip().startswith(b'<') else xml_from_pdf(data)
    return ET.fromstring(xml)


# ---------------------------------------------------------------------------
# Utilidades sobre los elementos del CVN
# ---------------------------------------------------------------------------

def clean(text) -> str:
    return re.sub(r'\s+', ' ', text or '').strip()


def items(root, code):
    return [it for it in root.findall('CvnItem') if it.findtext('CvnItemID/CVNPK/Item') == code]


def text(el, path) -> str:
    return clean(el.findtext(f'{path}/Item'))


def year(el, path) -> str:
    """Año de una fecha CVN (DayMonthYear o Year) bajo `path`."""
    for sub in ('DayMonthYear', 'Year'):
        v = text(el, f'{path}/{sub}')
        if v:
            return v[:4]
    return ''


def start_year(el):
    return year(el, 'Date/StartDate') or year(el, 'Date/OnlyDate')


def end_year(el):
    return year(el, 'Date/EndDate')


def sort_key(el):
    return (start_year(el) or end_year(el) or '0000')


def period(el, current=False) -> str:
    s, e = start_year(el), end_year(el)
    if current:
        return f'{s}–actualidad' if s else 'actualidad'
    if s and e and s != e:
        return f'{s}–{e}'
    return s or e


def join(*parts, sep=', ') -> str:
    return sep.join(p for p in parts if p)


def with_period(label, p) -> str:
    return f'{label} ({p})' if p else label


def entity(el) -> str:
    return text(el, 'Entity/EntityName')


def authors(el, path='Author', limit=3) -> str:
    def order(a):
        o = text(a, 'SignatureOrder')
        return int(o) if o.isdigit() else 999
    names = []
    for a in sorted(el.findall(path), key=order):
        family = text(a, 'FirstFamilyName')
        given = text(a, 'GivenName')
        initials = ''.join(w[0] for w in re.split(r'[\s.\-]+', given) if w)
        if family:
            names.append(f'{family} {initials}'.strip())
        elif text(a, 'Signature'):  # algunos CVN solo guardan la firma («C. Díaz-Sanahuja»)
            names.append(text(a, 'Signature'))
    if len(names) > limit:
        return ', '.join(names[:limit]) + ' et al.'
    return ', '.join(names)


def doi(el) -> str:
    for node in el.iter('Item'):
        m = DOI_RE.search(node.text or '')
        if m:
            return m.group(0).rstrip('.,;')
    return ''


# ---------------------------------------------------------------------------
# Apartados de la ficha
# ---------------------------------------------------------------------------

def build_degrees(root):
    out = []
    for el in sorted(items(root, DOCTORATE), key=sort_key, reverse=True):
        programme = text(el, 'Title/Name')
        grade = text(el, 'Link/Quality/Measure')
        label = join(f'Doctorado ({programme})' if programme else 'Doctorado', entity(el))
        if grade and not grade.isdigit():
            label += f', {grade}'
        out.append(with_period(label, year(el, 'Date/OnlyDate')))
    for el in sorted(items(root, DEGREES), key=sort_key, reverse=True):
        out.append(with_period(join(text(el, 'Title/Name'), entity(el)), year(el, 'Date/OnlyDate')))
    return out


def build_training(root, limit):
    els = items(root, SPECIALISED_TRAINING) + items(root, COURSES)
    out = []
    for el in sorted(els, key=sort_key, reverse=True)[:limit]:
        out.append(with_period(join(text(el, 'Title/Name'), entity(el)), period(el)))
    return out


def build_positions(root, limit):
    """Todos los puestos actuales y, después, los anteriores más recientes hasta `limit`."""
    out = []
    for el in sorted(items(root, POSITIONS_CURRENT), key=sort_key, reverse=True):
        out.append(with_period(join(text(el, 'Title/Name'), entity(el)), period(el, current=True)))
    for el in sorted(items(root, POSITIONS_PAST), key=sort_key, reverse=True):
        if len(out) >= limit:
            break
        out.append(with_period(join(text(el, 'Title/Name'), entity(el)), period(el)))
    return out


def project_code(el) -> str:
    code = text(el, 'ExternalPK/Code')
    # Hay CVN que meten en este campo la lista de entidades participantes: se descarta
    return code if code and len(code) <= 40 and ', ' not in code else ''


def build_grants(root, limit, include_contracts):
    els = items(root, PROJECTS) + (items(root, CONTRACTS) if include_contracts else [])
    # El mismo proyecto puede estar repetido (p. ej. una entrada por anualidad): se deja una.
    # Se agrupa por código; por título solo las entradas sin código (los proyectos renovados
    # pueden repetir título con otro código y son distintos)
    def norm_title(el):
        return re.sub(r'\W+', '', text(el, 'Title/Name').lower())
    unique, coded_titles = {}, set()
    for el in sorted(els, key=lambda e: (bool(project_code(e)), sort_key(e)), reverse=True):
        code = project_code(el)
        if code:
            unique.setdefault(('code', code.lower()), el)
            coded_titles.add(norm_title(el))
        elif norm_title(el) not in coded_titles:
            unique.setdefault(('title', norm_title(el)), el)
    out = []
    for el in sorted(unique.values(), key=sort_key, reverse=True)[:limit]:
        title = text(el, 'Title/Name')
        code = project_code(el)
        funder = text(el, 'Link/Entity/EntityName') or entity(el)
        label = f'{code}: {title}' if code else title
        out.append(with_period(join(label, funder), period(el)))
    return out


def build_publications(root, limit):
    els = [el for el in items(root, PUBLICATIONS)
           if (el.findtext('Subtype/SubType1/Item') or '') in PUBLICATION_TYPES]
    els.sort(key=lambda el: year(el, 'Date/OnlyDate') or '0000', reverse=True)
    out = []
    for el in els[:limit]:
        title = text(el, 'Title/Name').rstrip('.')
        source = text(el, 'Link/Title/Name')
        y = year(el, 'Date/OnlyDate')
        d = doi(el)
        parts = [authors(el), title, source, y]
        line = '. '.join(p.rstrip('.') for p in parts if p) + '.'
        if d:
            line += f' DOI: {d}'
        out.append(line)
    return out


def build_teaching(root, limit):
    out, seen = [], set()
    for el in sorted(items(root, TEACHING), key=sort_key, reverse=True):
        subject = text(el, 'Title/Name')
        programme = text(el, 'Link/Title/Name')
        key = (subject.lower(), programme.lower())
        if not subject or key in seen:
            continue
        seen.add(key)
        same = programme.lower() == subject.lower()
        out.append(join(f'{subject} ({programme})' if programme and not same else subject, entity(el)))
        if len(out) >= limit:
            break
    phd = [el for el in items(root, SUPERVISION) if el.findtext('Subtype/SubType1/Item') == SUPERVISION_PHD]
    for el in sorted(phd, key=sort_key, reverse=True):
        title = re.sub(r'^(Tesis( doctoral)?)\s*[-:]\s*', '', text(el, 'Title/Name'), flags=re.I)
        student = authors(el, limit=1)
        label = f'Dirección de tesis doctoral: «{title}»'
        if student:
            label += f' ({student})'
        out.append(with_period(join(label, entity(el)), year(el, 'Date/OnlyDate')))
    return out


def build_cv(root, args):
    return {
        'degrees': build_degrees(root),
        'otherTraining': build_training(root, args.max_formacion),
        'positions': build_positions(root, args.max_puestos),
        'grants': build_grants(root, args.max_proyectos, args.incluir_contratos),
        'publications': build_publications(root, args.max_publicaciones),
        'teaching': build_teaching(root, args.max_docencia),
    }


# ---------------------------------------------------------------------------
# Escritura en la ficha (sin dependencias: se reescribe el bloque `cv:` como texto)
# ---------------------------------------------------------------------------

def yaml_list(key, values, indent='  '):
    lines = [f'{indent}{key}:']
    lines += [f'{indent}    - {json.dumps(v, ensure_ascii=False)}' for v in values]
    return lines


def split_cv_block(frontmatter_lines):
    """Devuelve (inicio, fin, subapartados) del bloque `cv:` del frontmatter."""
    start = next((i for i, l in enumerate(frontmatter_lines) if re.match(r'^cv:\s*$', l)), None)
    if start is None:
        return None, None, {}
    end = start + 1
    while end < len(frontmatter_lines) and (not frontmatter_lines[end].strip() or frontmatter_lines[end][0] in ' \t'):
        end += 1
    sections, current = {}, None
    for line in frontmatter_lines[start + 1:end]:
        m = re.match(r'^  ([A-Za-z]+):', line)
        if m:
            current = m.group(1)
            sections[current] = []
        if current:
            sections[current].append(line)
    return start, end, sections


def update_member_file(path: Path, cv: dict):
    content = path.read_text(encoding='utf-8')
    m = re.match(r'^---\r?\n(.*?)\r?\n---\r?\n', content, re.S)
    if not m:
        sys.exit(f'Error: {path} no tiene frontmatter.')
    fm = m.group(1).split('\n')
    start, end, existing = split_cv_block(fm)

    block = ['cv:']
    order = ['title', 'degrees', 'otherTraining', 'positions', 'grants', 'publications', 'patents', 'teaching']
    for key in order + [k for k in existing if k not in order]:
        if key in cv and cv[key]:
            block += yaml_list(key, cv[key])
        elif key in existing:
            block += existing[key]  # se conserva lo que el CVN no aporta

    if start is None:
        fm += block
    else:
        fm = fm[:start] + block + fm[end:]
    path.write_text(f'---\n' + '\n'.join(fm) + '\n---\n' + content[m.end():], encoding='utf-8')


# ---------------------------------------------------------------------------

def main():
    p = argparse.ArgumentParser(description='Importa un CVN (FECYT) a la ficha de un miembro del grupo.')
    p.add_argument('cvn', nargs='?', help='PDF del CVN (o su cv.xml)')
    p.add_argument('--orcid', help='descargar el CVN publicado en línea en el editor de FECYT')
    dest = p.add_mutually_exclusive_group()
    dest.add_argument('--miembro', help='identificador de la ficha (p. ej. patricia-aspichueta)')
    dest.add_argument('--fichero', help='ruta de la ficha .md a actualizar')
    p.add_argument('--mostrar', action='store_true', help='mostrar el resultado sin escribir nada')
    p.add_argument('--max-publicaciones', type=int, default=10)
    p.add_argument('--max-proyectos', type=int, default=15)
    p.add_argument('--max-docencia', type=int, default=10, help='asignaturas (las tesis dirigidas van todas)')
    p.add_argument('--max-formacion', type=int, default=10)
    p.add_argument('--max-puestos', type=int, default=12, help='los puestos actuales se incluyen siempre')
    p.add_argument('--incluir-contratos', action='store_true',
                   help='añadir a los proyectos los contratos y convenios (por defecto solo proyectos competitivos)')
    args = p.parse_args()

    if bool(args.cvn) == bool(args.orcid):
        p.error('indica un fichero CVN o --orcid (uno de los dos)')
    if not args.mostrar and not (args.miembro or args.fichero):
        p.error('indica --miembro o --fichero, o usa --mostrar')

    root = load_cvn(args.cvn, args.orcid)
    cv = build_cv(root, args)

    for key, values in cv.items():
        print(f'{key}: {len(values)}', file=sys.stderr)
    if args.mostrar:
        print('\n'.join(['cv:'] + [l for k, v in cv.items() if v for l in yaml_list(k, v)]))
        return

    path = Path(args.fichero) if args.fichero else TEAM_DIR / f'{args.miembro}.md'
    if not path.exists():
        sys.exit(f'Error: no existe la ficha {path}')
    update_member_file(path, cv)
    print(f'Actualizada {path.relative_to(REPO) if path.is_relative_to(REPO) else path}. Revisa el cambio con git diff.')


if __name__ == '__main__':
    main()
