export interface FormattedProjectCode {
  displayCode: string;
  extraCount: number;
  fullCode: string;
}

/**
 * Formats multi-part project grant codes (e.g. ELKARTEK18/07;ELKARTEK18/08;...)
 * into a clean primary code with extra count indicator and full tooltip.
 */
export function formatProjectCode(rawCode?: string | null): FormattedProjectCode {
  if (!rawCode) {
    return { displayCode: '', extraCount: 0, fullCode: '' };
  }

  const parts = rawCode.split(/[;,]/).map(s => s.trim()).filter(Boolean);
  if (parts.length <= 1) {
    return { displayCode: rawCode.trim(), extraCount: 0, fullCode: rawCode.trim() };
  }

  return {
    displayCode: parts[0],
    extraCount: parts.length - 1,
    fullCode: parts.join('; ')
  };
}
