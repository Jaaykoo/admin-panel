import type { z } from 'zod';
import type {
  CategoryType,
  CreateCategorySchema,
  UpdateCategorySchema,
} from '@/schemas/CategorySchemas';

export type Category = CategoryType;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
