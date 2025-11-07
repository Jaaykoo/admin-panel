import { z } from 'zod';
import { AddressSchema, UpdateAddressSchema } from './AddressSchema';
import { UpdateUserProfileSchema, UserProfileSchema } from './ProfileSchemas';

export const UserRoleSchema = z.enum([
  'ADMIN',
  'PERSONNEL',
  'PARTICULIER',
  'ENTREPRISE',
]);

// ✅ GET USER
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  phone_number: z.string(),
  role: UserRoleSchema,
  is_active: z.boolean(),
  is_verified: z.boolean(),
  date_joined: z.string(),
  user_profile: UserProfileSchema,
  address: AddressSchema.optional(),
  avatar_url: z.string().optional(),
});

// ✅ POST ENTREPRISE
export const CreateEntrepriseUserSchema = z.object({
  email: z.string().email(),
  phone_number: z.string(),
  password: z.string(),
  role: z.literal('ENTREPRISE'),
  profile: z.object({
    first_name: z.string(),
    last_name: z.string(),
    title: z.string(),
    company_name: z.string(),
    service: z.string(),
    fonction: z.string(),
    siret_number: z.string(),
    phone_standard: z.string(),
  }),
  address: z.object({
    line1: z.string(),
    line4: z.string(),
    postcode: z.string(),
  }),
});

// ✅ POST ADMIN | PERSONNEL | PARTICULIER
export const CreateSimpleUserSchema = z.object({
  email: z.string().email(),
  phone_number: z.string(),
  password: z.string().optional(),
  role: z.enum(['ADMIN', 'PERSONNEL', 'PARTICULIER']),
  profile: z.object({
    first_name: z.string(),
    last_name: z.string(),
    title: z.string(),
    avatar: z.string().nullable().optional(),
  }),
  address: z.object({
    line1: z.string().optional(),
    line4: z.string().optional(),
    postcode: z.string().optional(),
  }).optional(),
});

// ✅ UNION FINALE POST
export const CreateUserSchema = z.union([
  CreateEntrepriseUserSchema,
  CreateSimpleUserSchema,
]);

// ✅ UPDATE USER (PATCH)
export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  phone_number: z.string().optional(),
  role: UserRoleSchema.optional(),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  profile: UpdateUserProfileSchema.optional(),
  address: UpdateAddressSchema.optional(),
});
