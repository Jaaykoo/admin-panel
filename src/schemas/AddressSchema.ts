import { z } from 'zod';

export const AddressSchema = z.object({
  id: z.number(),
  line1: z.string(),
  line2: z.string().optional(),
  line3: z.string().optional(),
  line4: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  user: z.number(),
});

// PATCH
export const UpdateAddressSchema = AddressSchema.partial();
