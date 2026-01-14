import type { FieldErrors, FieldValues, ResolverOptions, ResolverResult } from 'react-hook-form';
import type { z } from 'zod';

/**
 * Resolver personnalisé pour Zod 4 compatible avec React Hook Form
 * Zod 4 a une API différente de Zod 3, donc @hookform/resolvers n'est pas compatible
 */
export function zodResolver<T extends z.ZodTypeAny>(
  schema: T,
): <TFieldValues extends FieldValues, TContext>(
  values: TFieldValues,
  context: TContext | undefined,
  options: ResolverOptions<TFieldValues>,
) => Promise<ResolverResult<TFieldValues>> {
  return async (values, _context, _options) => {
    try {
      const result = await schema.parseAsync(values);
      return {
        values: result,
        errors: {},
      };
    } catch (error: any) {
      // Gestion des erreurs Zod 4
      if (error?.issues) {
        const errors: FieldErrors = {};

        for (const issue of error.issues) {
          const path = issue.path?.join('.') || 'root';

          if (!errors[path]) {
            errors[path] = {
              type: issue.code || 'validation',
              message: issue.message,
            };
          }
        }

        return {
          values: {},
          errors,
        };
      }

      // Erreur inattendue
      return {
        values: {},
        errors: {
          root: {
            type: 'validation',
            message: error?.message || 'Erreur de validation',
          },
        },
      };
    }
  };
}

export default zodResolver;

