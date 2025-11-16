import { z } from 'zod';

//
// ✅ GET CATEGORY
//
const BaseCategorySchema = z.object({
  id: z.number(),
  url: z.string(),
  breadcrumbs: z.string().optional(),
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  image: z.string().optional(),
  slug: z.string().optional(),
  is_public: z.boolean().default(true).optional(),
  ancestors_are_public: z.boolean().default(true).optional(),
});

// Type récursif pour les catégories avec enfants
export type CategoryType = z.infer<typeof BaseCategorySchema> & {
  children?: CategoryType[];
};

export const CategorySchema: z.ZodType<CategoryType> = BaseCategorySchema.extend({
  children: z.lazy(() => CategorySchema.array()).optional(),
});

//
// ✅ POST / CREATE CATEGORY
//
export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  code: z.string().optional(),
  description: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  image: z.string().optional(),
  slug: z.string().optional(),
  is_public: z.boolean().optional(),
  ancestors_are_public: z.boolean().optional(),
});

//
// ✅ UPDATE (PATCH)
//
export const UpdateCategorySchema = CreateCategorySchema.partial();
