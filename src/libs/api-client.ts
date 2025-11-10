import type { InternalAxiosRequestConfig } from 'axios';
import Axios from 'axios';

import Cookies from 'js-cookie';

import { useNotifications } from '@/components/ui/notifications';

import { Env } from './Env';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: Env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Ne pas traiter les erreurs réseau qui n'ont pas de réponse
    if (!error.response) {
      useNotifications.getState().addNotification({
        type: 'error',
        title: 'Erreur réseau',
        message: 'Impossible de se connecter au serveur. Vérifiez votre connexion.',
      });
      return Promise.reject(error);
    }

    // Ne pas afficher de notification ici, laisser le composant gérer avec get400ErrorMessage

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const pathname: string = window.location.pathname;
        if (!pathname.includes('auth/login')) {
          const searchParams = new URLSearchParams();
          const redirectTo
            = searchParams.get('redirectTo') || window.location.pathname;
          window.location.href = `/auth/login?redirectTo=${redirectTo}`;
        }
      }
    }

    return Promise.reject(error);
  },
);

// interceptor pour ajouter automatiquement le CSRF token
api.interceptors.request.use((config) => {
  // Méthodes qui nécessitent un CSRF token
  const method = config.method?.toUpperCase();

  const needsCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '');

  if (needsCsrf) {
    const csrfToken = Cookies.get('csrftoken'); // Django default cookie name
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }

  return config;
});

// if the endpoint requires the visiting user to be authenticated,
// attaching cookies is required for requests made on the server side
export const attachCookie = (
  cookie?: string,
  headers?: Record<string, string>,
) => {
  return {
    headers: {
      ...headers,
      ...(cookie ? { Cookie: cookie } : {}),
    },
  };
};
