import type { ApiError } from '@/helpers/ErrorMessageHelper';
import { useCallback, useState } from 'react';
import { displayApiError, getFieldError, parseApiError } from '@/helpers/ErrorMessageHelper';

/**
 * Hook personnalisé pour gérer les erreurs dans les formulaires
 * Usage:
 * const { error, handleError, clearError, hasFieldError } = useFormError();
 *
 * try {
 *   await apiCall();
 * } catch (err) {
 *   handleError(err);
 * }
 */
export const useFormError = () => {
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = useCallback((err: any): ApiError => {
    const apiError = parseApiError(err);
    setError(apiError);
    displayApiError(apiError);
    return apiError;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const hasFieldError = useCallback(
    (fieldName: string): boolean => {
      if (!error || !error.isValidationError()) {
        return false;
      }
      return getFieldError(error.fieldErrors, fieldName) !== null;
    },
    [error],
  );

  const getFieldErrorMessage = useCallback(
    (fieldName: string): string | null => {
      if (!error || !error.isValidationError()) {
        return null;
      }
      return getFieldError(error.fieldErrors, fieldName);
    },
    [error],
  );

  return {
    error,
    setError,
    handleError,
    clearError,
    hasFieldError,
    getFieldErrorMessage,
  };
};
