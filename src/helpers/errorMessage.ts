import { toast } from 'sonner';

/**
 * Classe personnalisée pour les erreurs API
 */
export class ApiError extends Error {
  statusCode: number;
  fieldErrors: Record<string, string[]>;
  extra: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    fieldErrors: Record<string, string[]> = {},
    extra: Record<string, any> = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    this.extra = extra;
  }

  isValidationError(): boolean {
    return this.statusCode === 400 && Object.keys(this.fieldErrors).length > 0;
  }

  isPermissionError(): boolean {
    return this.statusCode === 403;
  }

  isNotFoundError(): boolean {
    return this.statusCode === 404;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

/**
 * Aplatit les erreurs de champs imbriquées de manière récursive
 * Exemple: { og: { plaintes: ["erreur"] } } -> { "og.plaintes": ["erreur"] }
 */
export const flattenFieldErrors = (
  fieldErrors: Record<string, any>,
  prefix = '',
): Record<string, string[]> => {
  const flattened: Record<string, string[]> = {};

  Object.entries(fieldErrors).forEach(([key, value]) => {
    const fieldPath = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      // C'est un tableau de messages d'erreur
      flattened[fieldPath] = value.map(msg => String(msg));
    } else if (typeof value === 'object' && value !== null) {
      // C'est un objet imbriqué, récursion
      Object.assign(flattened, flattenFieldErrors(value, fieldPath));
    } else {
      // Cas imprévu, on stocke tel quel
      flattened[fieldPath] = [String(value)];
    }
  });

  return flattened;
};

/**
 * Extrait les messages d'erreur pour affichage dans un toast
 */
const extractErrorMessages = (obj: any, prefix = ''): string[] => {
  const messages: string[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    const fieldName = prefix ? `${prefix}.${key}` : key;
    const displayName = fieldName.replace(/_/g, ' ');

    if (Array.isArray(value)) {
      // Si c'est un tableau de messages d'erreur
      value.forEach((errorMsg: string) => {
        messages.push(`${displayName}: ${errorMsg}`);
      });
    } else if (typeof value === 'string') {
      // Si c'est un message d'erreur simple
      messages.push(`${displayName}: ${value}`);
    } else if (typeof value === 'object' && value !== null) {
      // Si c'est un objet imbriqué, on descend récursivement
      const nestedMessages = extractErrorMessages(value, fieldName);
      messages.push(...nestedMessages);
    }
  });

  return messages;
};

/**
 * Récupère le premier message d'erreur pour un champ donné
 */
export const getFieldError = (
  fieldErrors: Record<string, any>,
  fieldName: string,
): string | null => {
  const flatErrors = flattenFieldErrors(fieldErrors);
  const errors = flatErrors[fieldName];
  return errors && errors.length > 0 ? errors[0] : null;
};

/**
 * Récupère tous les messages d'erreur pour un champ donné
 */
export const getFieldErrors = (
  fieldErrors: Record<string, any>,
  fieldName: string,
): string[] => {
  const flatErrors = flattenFieldErrors(fieldErrors);
  return flatErrors[fieldName] || [];
};

/**
 * Parse la réponse d'erreur et crée un objet ApiError
 */
export const parseApiError = (error: any): ApiError => {
  const statusCode = error?.response?.status || 500;
  const responseData = error?.response?.data;

  // Cas 1: Structure hacksoft avec message et extra.fields
  if (responseData?.message && responseData?.extra?.fields) {
    return new ApiError(
      responseData.message,
      statusCode,
      responseData.extra.fields,
      responseData.extra,
    );
  }

  // Cas 2: Structure directe avec champs imbriqués (ex: { og: { plaintes: [...] }, od: { plaintes: [...] } })
  if (responseData && typeof responseData === 'object' && !responseData.message && !responseData.detail) {
    // Vérifier si ça ressemble à des erreurs de champs
    const hasFieldErrors = Object.values(responseData).some(
      value => typeof value === 'object' || Array.isArray(value),
    );

    if (hasFieldErrors) {
      return new ApiError(
        'Erreur de validation',
        statusCode,
        responseData,
        {},
      );
    }
  }

  // Cas 3: Structure avec detail (ancien format ou erreurs serveur)
  if (responseData?.detail) {
    // Si detail est un objet avec des champs
    if (typeof responseData.detail === 'object' && !Array.isArray(responseData.detail)) {
      // Vérifier si c'est des erreurs de champs ou non_field_errors
      if (responseData.detail.non_field_errors) {
        return new ApiError(
          'Erreur de validation',
          statusCode,
          { non_field_errors: responseData.detail.non_field_errors },
          {},
        );
      }

      return new ApiError(
        'Erreur lors de l\'opération',
        statusCode,
        responseData.detail,
        {},
      );
    }

    // Si detail est une string
    if (typeof responseData.detail === 'string') {
      return new ApiError(
        responseData.detail,
        statusCode,
        {},
        {},
      );
    }
  }

  // Cas 4: Erreur générique
  return new ApiError(
    error?.message || 'Une erreur est survenue',
    statusCode,
    {},
    {},
  );
};

/**
 * Affiche les erreurs avec des toasts intelligents
 */
export const displayApiError = (apiError: ApiError): void => {
  if (apiError.isValidationError()) {
    const flatErrors = flattenFieldErrors(apiError.fieldErrors);
    const errorCount = Object.keys(flatErrors).length;

    // Gérer les non_field_errors séparément
    if (flatErrors.non_field_errors) {
      // Afficher chaque non_field_error
      flatErrors.non_field_errors.forEach((msg) => {
        // Nettoyer les messages d'erreur SQL trop verbeux
        const cleanMsg = msg.includes('violates not-null constraint')
          ? 'Un champ obligatoire est manquant. Veuillez vérifier le formulaire.'
          : msg.includes('DETAIL:')
            ? msg.split('DETAIL:')[0].trim()
            : msg;

        toast.error(cleanMsg, { duration: 6000 });
      });

      // Ne pas afficher le résumé si on a déjà affiché les non_field_errors
      if (errorCount === 1) {
        return;
      }
    }

    // Extraire tous les messages pour affichage
    const allMessages = extractErrorMessages(apiError.fieldErrors);

    // Si peu d'erreurs (≤ 3), afficher chacune
    if (allMessages.length <= 3 && allMessages.length > 0) {
      allMessages.forEach((msg) => {
        toast.error(msg, { duration: 5000 });
      });
    } else if (allMessages.length > 3) {
      // Sinon, afficher un résumé
      toast.error(`${errorCount} erreur(s) de validation détectée(s)`, {
        description: 'Veuillez corriger les champs en erreur ci-dessous',
        duration: 6000,
      });
    }
  } else if (apiError.isPermissionError()) {
    toast.error('Permission refusée', {
      description: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action',
      duration: 5000,
    });
  } else if (apiError.isNotFoundError()) {
    toast.error('Ressource introuvable', {
      description: apiError.message,
      duration: 4000,
    });
  } else if (apiError.isServerError()) {
    toast.error('Erreur serveur', {
      description: 'Une erreur est survenue côté serveur. Veuillez réessayer plus tard.',
      duration: 5000,
    });
  } else {
    toast.error(apiError.message, { duration: 4000 });
  }
};

/**
 * Transforme les erreurs en format compatible avec React Hook Form
 */
export const toReactHookFormErrors = (fieldErrors: Record<string, any>) => {
  const flatErrors = flattenFieldErrors(fieldErrors);
  const rhfErrors: Record<string, { type: string; message: string }> = {};

  Object.entries(flatErrors).forEach(([field, messages]) => {
    // Ignorer non_field_errors car ce n'est pas un champ
    if (field === 'non_field_errors') {
      return;
    }

    rhfErrors[field] = {
      type: 'server',
      message: messages[0],
    };
  });

  return rhfErrors;
};

/**
 * Fonction principale pour gérer les erreurs (API compatible avec l'ancienne version)
 * Utilise la nouvelle structure mais garde la même signature
 */
export const get400ErrorMessage = (error: any): ApiError => {
  const apiError = parseApiError(error);
  displayApiError(apiError);
  return apiError;
};
