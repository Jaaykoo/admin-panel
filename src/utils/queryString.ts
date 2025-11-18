/**
 * Convertit un objet en chaîne de requête URL
 * @param obj - L'objet à convertir
 * @returns La chaîne de requête formatée
 */
export function queryStringFromObject(obj: Record<string, any>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  }

  return params.toString();
}

/**
 * Parse une chaîne de requête en objet
 * @param queryString - La chaîne de requête à parser
 * @returns L'objet parsé
 */
export function objectFromQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const obj: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }

  return obj;
}
