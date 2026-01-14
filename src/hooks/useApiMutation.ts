import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { UseFormSetError } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { get400ErrorMessage, toReactHookFormErrors } from '@/helpers/ErrorMessageHelper';

/**
 * Options étendues pour useApiMutation
 */
type UseApiMutationOptions<TData, TError, TVariables, TContext> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'onError'
> & {
  /**
   * Callback onError personnalisé (appelé après la gestion automatique des erreurs)
   */
  onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void;
  /**
   * Fonction setError de React Hook Form pour injecter les erreurs de validation dans le formulaire
   */
  setFormError?: UseFormSetError<any>;
  /**
   * Désactiver l'affichage automatique des toasts d'erreur
   */
  disableErrorToast?: boolean;
};

/**
 * Hook personnalisé qui wrap useMutation avec gestion automatique des erreurs API
 *
 * Features:
 * - Affiche automatiquement les erreurs via toast (get400ErrorMessage)
 * - Injecte automatiquement les erreurs de validation dans React Hook Form (si setFormError fourni)
 * - Conserve toutes les fonctionnalités de useMutation
 *
 * @example
 * // Usage basique
 * const mutation = useApiMutation({
 *   mutationFn: createProduct,
 *   onSuccess: () => toast.success('Produit créé'),
 * });
 *
 * @example
 * // Avec injection des erreurs dans React Hook Form
 * const { setError } = useForm();
 * const mutation = useApiMutation({
 *   mutationFn: createProduct,
 *   setFormError: setError,
 *   onSuccess: () => toast.success('Produit créé'),
 * });
 */
export function useApiMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseApiMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { onError, setFormError, disableErrorToast, ...restOptions } = options;

  return useMutation({
    ...restOptions,
    onError: (error, variables, context) => {
      // 1. Afficher les erreurs via toast (sauf si désactivé)
      if (!disableErrorToast) {
        const apiError = get400ErrorMessage(error);

        // 2. Injecter les erreurs dans React Hook Form si setFormError est fourni
        if (setFormError && apiError.isValidationError()) {
          const formErrors = toReactHookFormErrors(apiError.fieldErrors);
          Object.entries(formErrors).forEach(([field, errorInfo]) => {
            setFormError(field, errorInfo);
          });
        }
      }

      // 3. Appeler le callback onError personnalisé si fourni
      onError?.(error, variables, context);
    },
  });
}

/**
 * Version simplifiée pour les cas où on n'a pas besoin d'options supplémentaires
 */
export function useApiMutationSimple<TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseApiMutationOptions<TData, unknown, TVariables, unknown>, 'mutationFn'>,
): UseMutationResult<TData, unknown, TVariables, unknown> {
  return useApiMutation({
    mutationFn,
    ...options,
  });
}

