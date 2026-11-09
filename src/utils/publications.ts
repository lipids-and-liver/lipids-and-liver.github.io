// Publicaciones de cada persona del equipo, a partir del listado general (src/content/publications).
// La autoría se reconoce por el nombre en la lista de autores, que viene en dos formatos:
//   «Aspichueta P», «Garcia-Rodriguez JL» (PubMed) o «Patricia Aspichueta», «Juan L García-Rodríguez».
// Regla: tiene que aparecer el primer apellido, coincidir la inicial del nombre y no haber otro
// apellido distinto (así «Sainz-Ramirez N» no se confunde con «Natalia Sainz»).
// Si alguien firma de otra forma, su ficha puede indicar las variantes exactas en `publicationNames`.

export interface AuthorKey {
  given: string[];
  surnames: string[];
}

const normalize = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-.]/g, ' ').replace(/[^a-z ]/g, ' ');
const words = (s: string) => normalize(s).split(/\s+/).filter(Boolean);

// «Dra. Patricia Aspichueta Celaá» → nombre [patricia], apellidos [aspichueta, celaa].
// Con cuatro palabras o más se toman dos como nombre (Juan Luis, Jose Antonio…).
export function authorKeyFromName(fullName: string): AuthorKey {
  // Fuera tratamientos y títulos en los tres idiomas (Dra., Prof., «doktorea»…)
  const TITLES = /^(dra?|prof|profa|doctor|doctora|phd|doktorea|irakaslea)\.?$/i;
  const parts = fullName.replace(/\(.*?\)/g, '').trim().split(/\s+/).filter(p => !TITLES.test(p));
  const givenCount = parts.length >= 4 ? 2 : 1;
  return {
    given: parts.slice(0, givenCount).flatMap(words),
    surnames: parts.slice(givenCount).flatMap(words),
  };
}

const IGNORED = new Set(['and', 'y', 'et', 'al']);
// Apellidos muy frecuentes: con solo el primer apellido y la inicial no basta para saber que es la misma persona
const COMMON_SURNAMES = new Set(('garcia gonzalez lopez fernandez rodriguez martinez sanchez perez gomez ortiz jimenez diaz ' +
  'ruiz alonso hernandez moreno munoz alvarez romero navarro torres dominguez gil vazquez serrano ramos blanco molina ' +
  'castro ortega rubio marin sanz iglesias nunez medina garrido santos castillo cortes lozano cano prieto mendez cruz ' +
  'calvo gallego herrera marquez leon vidal flores cabrera campos vega fuentes reyes nieto aguilar pascual lorenzo').split(' '));

export function authorMatches(author: string, key: AuthorKey): boolean {
  const w = words(author);
  const [first, second] = key.surnames;
  if (!first || !w.includes(first)) return false;
  const known = new Set([...key.surnames, ...key.given]);
  // Otra palabra larga que no es ni su nombre ni sus apellidos → es otra persona
  if (w.some(x => x.length > 3 && !known.has(x) && !IGNORED.has(x))) return false;
  const fullGiven = w.some(x => key.given.includes(x));
  // Apellido común sin el segundo apellido: hace falta el nombre completo
  if (COMMON_SURNAMES.has(first) && second && !w.includes(second) && !fullGiven) return false;
  if (fullGiven) return true;
  // Iniciales («JL», «P»): con dos nombres tienen que coincidir las dos, salvo que aparezcan los dos apellidos
  const initials = key.given.map(g => g[0]).join('');
  const bothSurnames = Boolean(second && w.includes(second));
  return w.some(x => x.length <= 3 && !key.surnames.includes(x) &&
    (key.given.length > 1 && !bothSurnames ? x.startsWith(initials) : x[0] === initials[0]));
}

export const splitAuthors = (authors: string) =>
  authors.replace(/\.$/, '').split(/\s*[,;]\s*/).map(a => a.trim()).filter(Boolean);

export interface MemberPublication<T> {
  pub: T;
  authorIndex: number;
}

export function publicationsForMember<T extends { data: { authors: string; year: string | number; title: string } }>(
  pubs: T[],
  member: { name: string; publicationNames?: string[] | null },
): MemberPublication<T>[] {
  const exact = (member.publicationNames || []).map(n => normalize(n).trim()).filter(Boolean);
  const key = authorKeyFromName(member.name);
  return pubs
    .map(pub => {
      const list = splitAuthors(pub.data.authors);
      const authorIndex = list.findIndex(a =>
        exact.length ? exact.includes(normalize(a).trim()) : authorMatches(a, key));
      return { pub, authorIndex };
    })
    .filter(m => m.authorIndex >= 0)
    .sort((a, b) => Number(b.pub.data.year) - Number(a.pub.data.year) || a.pub.data.title.localeCompare(b.pub.data.title));
}
