/**
 * Helper pour extraire l'ID depuis une URL d'API
 * @param url - L'URL contenant l'ID à extraire (ex: http://localhost:8000/api/admin/catalogue/productattributes/67/)
 * @returns L'ID extrait ou null si non trouvé
 */
export function extractIdFromUrl(url: string): number | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Utilise une regex pour extraire le dernier nombre avant le slash final
  const match = url.match(/\/(\d+)\/?$/);

  if (match && match[1]) {
    const id = parseInt(match[1], 10);
    return isNaN(id) ? null : id;
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
    const id = parseInt(lastPart, 10);
    return isNaN(id) ? null : id;
  }

  return null;
}

/**
 * Helper pour extraire le slug depuis une URL d'API Product Class
 * @param url - L'URL contenant le slug à extraire (ex: http://localhost:8000/api/admin/catalogue/productclasses/ordinateur-de-bureau/)
 * @returns Le slug extrait ou null si non trouvé
 */
export function extractProductClassSlugFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Pattern pour les URLs de product classes: /api/admin/catalogue/productclasses/{slug}/
  const match = url.match(/\/productclasses\/([^\/]+)\/?$/);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Helper générique pour extraire le slug depuis n'importe quelle URL d'API
 * @param url - L'URL contenant le slug à extraire
 * @returns Le slug extrait ou null si non trouvé
 */
export function extractSlugFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Supprime le slash final s'il existe et split par '/'
  const parts = url.replace(/\/$/, '').split('/');
  const lastPart = parts[parts.length - 1];

  // Vérifie que le dernier segment n'est pas vide et n'est pas un nombre pur
  if (lastPart && lastPart.trim() !== '' && !/^\d+$/.test(lastPart)) {
    return lastPart;
  }

  return null;
}

/**
 * Helper pour extraire le slug depuis une URL de catégorie
 * @param url - L'URL contenant le slug à extraire (ex: http://localhost:8000/api/admin/catalogue/categories/electronics/)
 * @returns Le slug extrait ou null si non trouvé
 */
export function extractCategorySlugFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Pattern pour les URLs de catégories: /api/admin/catalogue/categories/{slug}/
  const match = url.match(/\/categories\/([^\/]+)\/?$/);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}
