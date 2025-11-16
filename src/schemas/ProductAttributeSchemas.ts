import { z } from 'zod';
import { OptionGroupSchema } from '@/schemas/ProductOptionGroupSchemas';

export const ProductAttributeSchema = z.object({
  url: z.string(),
  name: z.string(),
  code: z.string(),
  type: z.enum(['text', 'integer', 'float', 'boolean', 'date']),
  required: z.boolean().default(false),
  option_group: OptionGroupSchema,
});

export const ProductAttributeCreateSchema = z.object({
  name: z.string(),
  code: z.string(),
  type: z.enum(['text', 'integer', 'float', 'boolean', 'date']),
  required: z.boolean(),
  option_group: OptionGroupSchema.optional(),

});

export const ProductAttributeUpdateSchema = ProductAttributeCreateSchema.partial();
