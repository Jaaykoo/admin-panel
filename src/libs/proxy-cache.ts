import { revalidateTag } from 'next/cache';

/**
 * Utilitaires pour gérer le cache du proxy
 * Ces fonctions permettent d'invalider le cache utilisateur quand nécessaire
 */

/**
 * Invalide le cache utilisateur pour une session spécifique
 * À appeler lors de la déconnexion ou modification du profil
 *
 * @param sessionId - ID de la session à invalider
 * @example
 * ```typescript
 * // Dans votre route de logout
 * import { invalidateUserCache } from '@/libs/proxy-cache';
 *
 * export async function POST() {
 *   const sessionId = cookies().get('sessionid')?.value;
 *   if (sessionId) {
 *     await invalidateUserCache(sessionId);
 *   }
 *   // ... reste du logout
 * }
 * ```
 */
export async function invalidateUserCache(sessionId: string): Promise<void> {
  try {
    // @ts-expect-error
    revalidateTag(`user-${sessionId}`);
    console.warn(`[Cache] Invalidated cache for session: ${sessionId.substring(0, 8)}...`);
  } catch (error) {
    console.error('[Cache] Failed to invalidate user cache:', error);
  }
}

/**
 * Invalide tous les caches utilisateurs
 * À utiliser avec précaution (par exemple, après une mise à jour globale)
 */
export async function invalidateAllUserCaches(): Promise<void> {
  try {
    // Note: Cette approche est limitée car nous ne pouvons pas lister tous les tags
    // Il faudrait maintenir une liste des sessions actives si nécessaire
    console.warn('[Cache] Invalidating all user caches - this may not work as expected');
  } catch (error) {
    console.error('[Cache] Failed to invalidate all caches:', error);
  }
}
