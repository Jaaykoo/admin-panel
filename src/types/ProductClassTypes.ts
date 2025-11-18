import type { z } from 'zod';
import type { ProductClassCreateSchema, ProductClassSchema, ProductClassUpdateSchema } from '@/schemas/ProductClassSchemas';

export type ProductClass = z.infer<typeof ProductClassSchema>;
export type ProductClassCreate = z.infer<typeof ProductClassCreateSchema>;
export type ProductClassUpdate = z.infer<typeof ProductClassUpdateSchema>;
