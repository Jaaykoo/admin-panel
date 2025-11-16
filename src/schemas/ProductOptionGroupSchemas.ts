import { z } from 'zod';

export const OptionGroupSchema = z.object({
  name: z.string(),
  code: z.string(),
  options: z.array(z.string()).optional(),
  url: z.string(),
});

export const OptionGroupCreateSchema = z.object({
  name: z.string(),
  code: z.string(),
  options: z.array(z.string()).optional(),
});

export const OptionGroupUpdateSchema = OptionGroupCreateSchema.partial();
