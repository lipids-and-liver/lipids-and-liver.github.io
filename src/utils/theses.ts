/**
 * Helper utilities for PhD theses sorting and filtering
 */

export function extractThesisYear(yearVal: string | number | undefined): number {
  if (!yearVal) return 0;
  if (typeof yearVal === 'number') return yearVal;
  const matches = String(yearVal).match(/\b(20\d{2}|19\d{2})\b/g);
  if (!matches || matches.length === 0) return 0;
  // Return the first 4-digit year found (e.g. 2024 from '2024-2027', or 2023 from '2023')
  return parseInt(matches[0], 10);
}

/**
 * Sorts theses so that:
 * 1. Tesis en curso ('ongoing') always appear before defendidas ('completed').
 * 2. Within each group, the most recent theses (newest year) appear first.
 * 3. Any newly added thesis automatically appears at the top of its section, never at the tail.
 * 4. Ties are resolved by the optional 'order' field.
 */
export function sortTheses<T extends { data: { status: 'ongoing' | 'completed' | string; year: string | number; order?: number } }>(theses: T[]): T[] {
  return theses.sort((a, b) => {
    // 1. Status: 'ongoing' first, 'completed' second
    if (a.data.status !== b.data.status) {
      return a.data.status === 'ongoing' ? -1 : 1;
    }

    // 2. Year descending (most recent first)
    const yearA = extractThesisYear(a.data.year);
    const yearB = extractThesisYear(b.data.year);
    if (yearB !== yearA) {
      return yearB - yearA;
    }

    // 3. Fallback tie-breaker: order ascending
    const orderA = a.data.order ?? 99;
    const orderB = b.data.order ?? 99;
    return orderA - orderB;
  });
}
