import type { z } from 'zod';
import type {
  CategorySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
} from '@/schemas/CategorySchemas';

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
