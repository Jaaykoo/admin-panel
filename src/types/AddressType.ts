import type { z } from 'zod';
import type { AddressSchema } from '@/schemas/AddressSchema';

export type AddressType = z.infer<typeof AddressSchema>;
