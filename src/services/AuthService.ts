import type { AuthResponse } from '@/types/_types';
import type { User } from '@/types/UserTypes';
import { api } from '@/libs/api-client';

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features
export const login = (email: string, password: string): Promise<AuthResponse> => {
  return api.post('/auth/login/', { email, password });
};

export const logout = (): Promise<void> => {
  return api.post('/auth/logout/');
};

export const getUser = (): Promise<User> => {
  return api.get<User>('/users/me/');
};

export function resetPassword(email: string): Promise<void> {
  return api.post('/auth/password-reset/', {
    email,
  }).then(() => {});
}

export function verifyTwoFactorCode(code: string): Promise<void> {
  return api.get('/auth/password-reset/verify/', {
    params: {
      code,
    },
  }).then(() => {});
}

export function resetPasswordWithCode(code: string, password: string): Promise<void> {
  return api.post('/auth/password-reset/verified/', {
    code,
    password,
  }).then(() => {});
}

export function getNewPasswordResetCode(email: string): Promise<void> {
  return api.post('/auth/last-password-reset-code/', {
    email,
  }).then(() => {});
}
