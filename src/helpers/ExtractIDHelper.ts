/**
 * Helper pour extraire l'ID depuis une URL d'API
 * @param url - L'URL contenant l'ID à extraire
 * @returns L'ID extrait ou null si non trouvé
 */
export function extractIdFromUrl(url: string): number | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Utilise une regex pour extraire le dernier nombre avant le slash final
  const match = url.match(/\/(\d+)\/?$/);

  if (match && match[1]) {
    const id = Number.parseInt(match[1], 10);
    return Number.isNaN(id) ? null : id;
  }

  return null;
}

/**
 * Helper alternatif utilisant split pour extraire l'ID
 * @param url - L'URL contenant l'ID à extraire
 * @returns L'ID extrait ou null si non trouvé
 */
export function extractIdFromUrlAlt(url: string): number | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Supprime le slash final s'il existe et split par '/'
  const parts = url.replace(/\/$/, '').split('/');
  const lastPart = parts[parts.length - 1];

  if (lastPart && /^\d+$/.test(lastPart)) {
    const id = Number.parseInt(lastPart, 10);
    return isNaN(id) ? null : id;
  }

  return null;
}
