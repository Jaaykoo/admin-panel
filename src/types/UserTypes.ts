import type { z } from 'zod';
import type { AddressSchema } from '@/schemas/AddressSchema';
import type { UserProfileSchema } from '@/schemas/ProfileSchemas';
import type { CreateUserSchema, UpdateUserSchema, UserRoleSchema, UserSchema } from '@/schemas/UserSchemas';

export type Address = z.infer<typeof AddressSchema>;

export type UserRole = z.infer<typeof UserRoleSchema>;

export type UserProfile = z.infer<typeof UserProfileSchema>;

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
