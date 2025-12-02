import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Proxy Next.js 16+ pour gérer l'authentification et l'autorisation
 * Documentation: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 *
 * Note: proxy.ts remplace middleware.ts dans Next.js 16+
 * - S'exécute en Edge Runtime (ultra rapide)
 * - Pas de variables globales persistantes
 * - Utiliser process.env directement
 * - Limite de 1MB pour le bundle
 */

export async function proxy(request: NextRequest) {
  console.warn(`[Proxy] 🚀 Request received: ${request.method} ${request.nextUrl.pathname}`);

  // Routes publiques accessibles sans authentification
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/forgot-password/reset',
    '/auth/forgot-password/email-sent',
    '/auth/forgot-password/verify-otp',
  ];

  // Vérifier si la route commence par /auth/ (toutes les routes auth sont publiques)
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth/');

  const isPublicPath = isAuthRoute || publicPaths.includes(
    request.nextUrl.pathname,
  );

  // Autoriser les assets statiques et fichiers Next.js
  const staticPaths = [
    '/_next',
    '/assets',
    '/favicon.ico',
    '/logo.png',
    '/Logo.svg',
    '/apple-touch-icon.png',
  ];

  const isStaticPath = staticPaths.some(path =>
    request.nextUrl.pathname.startsWith(path),
  );

  const isStaticFile = /\.(?:png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/i.test(
    request.nextUrl.pathname,
  );

  if (isStaticPath || isStaticFile) {
    return NextResponse.next();
  }

  // Autoriser les routes publiques
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Vérifier la présence du cookie de session (HTTP-only)
  const sessionId = request.cookies.get('sessionid')?.value;

  if (!sessionId) {
    return redirectToLogin(request);
  }

  // Récupérer les informations utilisateur depuis l'API backend
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error('[Proxy] NEXT_PUBLIC_API_URL is not defined');
      return redirectToLogin(request, true);
    }

    console.warn(`[Proxy] 🔍 Fetching user data from: ${apiUrl}/users/me/`);
    console.warn(`[Proxy] 🍪 SessionID: ${sessionId}`);

    // Appel fetch direct avec les cookies de session (ne pas utiliser le service getUser côté client)
    const response = await fetch(`${apiUrl}/users/me/`, {
      method: 'GET',
      headers: {
        'Cookie': `sessionid=${sessionId}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store', // Ne pas mettre en cache les infos utilisateur
    });

    console.warn(`[Proxy] 📡 API Response status: ${response.status}`);

    // Si la requête échoue (session invalide, expirée, etc.)
    if (!response.ok) {
      console.warn(`[Proxy] ❌ Auth check failed with status: ${response.status}`);
      return destroySessionAndRedirect(request, 'session_invalid');
    }

    // Parser la réponse JSON
    let user;
    try {
      const responseData = await response.json();
      console.warn('[Proxy] ========================================');
      console.warn('[Proxy] 📦 RAW API Response:', JSON.stringify(responseData));
      console.warn('[Proxy] ========================================');

      // Extraire les données utilisateur (gérer différentes structures de réponse)
      user = responseData.data || responseData;
    } catch (parseError) {
      console.error('[Proxy] ❌ Failed to parse JSON response:', parseError);
      return destroySessionAndRedirect(request, 'invalid_response');
    }

    // Vérifier si l'utilisateur existe et a un rôle
    if (!user || typeof user !== 'object') {
      console.warn('[Proxy] ❌ Invalid user data structure');
      return destroySessionAndRedirect(request, 'invalid_user');
    }

    if (!user.role) {
      console.warn('[Proxy] ❌ User has no role property');
      return destroySessionAndRedirect(request, 'no_role');
    }

    // Normaliser le rôle en majuscules pour la comparaison
    const userRole = String(user.role).toUpperCase();

    // Logs détaillés pour déboguer
    console.warn('[Proxy] ========================================');
    console.warn(`[Proxy] 👤 User ID: ${user.id}`);
    console.warn(`[Proxy] 📧 User email: ${user.email}`);
    console.warn(`[Proxy] 🎭 User role (original): "${user.role}"`);
    console.warn(`[Proxy] 🎭 User role (normalized): "${userRole}"`);
    console.warn(`[Proxy] 🔐 Is Admin? ${userRole === 'ADMIN'}`);
    console.warn(`[Proxy] 🛣️  Requested path: ${request.nextUrl.pathname}`);
    console.warn('[Proxy] ========================================');

    // Toutes les routes protégées (non-auth) nécessitent le rôle ADMIN
    if (userRole !== 'ADMIN') {
      console.warn(
        `[Proxy] ⛔ ACCESS DENIED - User role: "${userRole}" attempting to access: ${request.nextUrl.pathname}`,
      );
      console.warn('[Proxy] 🗑️  Destroying session and redirecting to login...');
      return destroySessionAndRedirect(request, 'forbidden');
    }

    console.warn(`[Proxy] ✅ ACCESS GRANTED - Admin user (${user.email}) accessing: ${request.nextUrl.pathname}`);

    // Tout est OK, autoriser l'accès
    const responseNext = NextResponse.next();

    // Ajouter des headers personnalisés avec les infos utilisateur
    // Ces headers seront disponibles dans vos Server Components
    responseNext.headers.set('x-user-id', user.id?.toString() || '');
    responseNext.headers.set('x-user-role', userRole);
    responseNext.headers.set('x-user-email', user.email || '');

    return responseNext;
  } catch (error) {
    // Erreur réseau ou API indisponible
    console.error('[Proxy] ❌ Unexpected error:', error);
    return destroySessionAndRedirect(request, 'error');
  }
}

/**
 * Redirige vers la page de login
 * @param request - La requête Next.js
 * @param clearCookies - Si true, supprime les cookies de session
 */
function redirectToLogin(
  request: NextRequest,
  clearCookies = false,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = '/auth/login';

  // Conserver l'URL d'origine pour redirection après login
  if (request.nextUrl.pathname !== '/' && request.nextUrl.pathname !== '/auth/login') {
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
  }

  const response = NextResponse.redirect(url);

  if (clearCookies) {
    // Supprimer les cookies de session
    response.cookies.delete('sessionid');
    response.cookies.delete('csrftoken');
  }

  return response;
}

/**
 * Détruit la session et redirige vers login
 * @param request - La requête Next.js
 * @param reason - Raison de la destruction (pour affichage)
 */
function destroySessionAndRedirect(
  request: NextRequest,
  reason?: string,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = '/auth/login';

  if (reason) {
    url.searchParams.set('reason', reason);
  }

  const response = NextResponse.redirect(url);

  // Supprimer tous les cookies de session
  response.cookies.delete('sessionid');
  response.cookies.delete('csrftoken');

  return response;
}

/**
 * Configuration pour Next.js 16+ proxy.ts
 * Documentation: https://nextjs.org/docs/app/api-reference/file-conventions/proxy#config
 */
export const config = {
  matcher: [
    /*
     * Matcher pour Next.js 16+ proxy.ts
     * Correspondre à tous les chemins de requête SAUF :
     * - /api/* (routes API)
     * - /_next/* (fichiers statiques et internes Next.js)
     * - /_vercel/* (fichiers Vercel)
     * - /monitoring/* (monitoring, health checks)
     * - fichiers statiques avec extensions
     */
    '/((?!api|_next|_vercel|monitoring|.*\\..*).*)',
  ],
};
