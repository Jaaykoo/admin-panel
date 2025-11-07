import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  title: z.string(),
  birthdate: z.string().optional(),
  mobile: z.string().optional(),
  fax: z.string().optional(),
  phone_standard: z.string().optional(),
  siret_number: z.string().optional(),
  tva_number: z.string().optional(),
  company_name: z.string().optional(),
  service: z.string().optional(),
  fonction: z.string().optional(),
  avatar: z.string().nullable().optional(),
  user: z.number(),
});

// PATCH
export const UpdateUserProfileSchema = UserProfileSchema.partial();
