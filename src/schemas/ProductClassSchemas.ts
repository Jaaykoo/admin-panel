import { z } from 'zod';
import { OptionGroupSchema } from '@/schemas/ProductOptionGroupSchemas';

const attributesSchema = z.object({
  url: z.string(),
  option_group: OptionGroupSchema,
  type: z.enum(['text', 'integer', 'float', 'boolean', 'date']),
  required: z.boolean().default(false),
  name: z.string(),
  code: z.string(),
});
export const ProductClassSchema = z.object({
  url: z.string(),
  name: z.string(),
  code: z.string(),
  requires_shipping: z.boolean().default(true),
  track_stock: z.boolean().default(true),
  attributes: z.array(attributesSchema),
});

export const ProductClassCreateSchema = z.object({
  name: z.string(),
  code: z.string(),
  requires_shipping: z.boolean().default(true),
  track_stock: z.boolean().default(true),
  attributes: z.array(attributesSchema),
});

export const ProductClassUpdateSchema = ProductClassCreateSchema.partial();
