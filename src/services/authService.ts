import type { AuthResponse } from '@/types/_types';
import type { User } from '@/types/UserTypes';

import { api } from '@/libs/api-client';

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features
export const login = (email: string, password: string): Promise<AuthResponse> => {
  return api.post('/auth/login', { email, password });
};

export const logout = (): Promise<void> => {
  return api.post('/auth/logout');
};

export const getUser = async (): Promise<User> => {
  const response = (await api.get('/auth/me')) as { data: User };

  return response.data;
};
