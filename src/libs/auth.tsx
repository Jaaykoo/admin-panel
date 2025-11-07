import type { AuthResponse } from '@/types/_types';
import type { User } from '@/types/UserTypes';

import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';
import { api } from './api-client';

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features
const loginWithEmailAndPassword = (email: string, password: string): Promise<AuthResponse> => {
  return api.post('/auth/login', { email, password });
};

const logout = (): Promise<void> => {
  return api.post('/auth/logout');
};

export const getUser = async (): Promise<User> => {
  const response = (await api.get('/auth/me')) as { data: User };

  return response.data;
};

const userQueryKey = ['user'];

export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: userQueryKey,
    queryFn: getUser,
  });
};

export const useUser = () => useQuery(getUserQueryOptions());

export const useLogin = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ email, password }: { email: string; password: string }) =>
      loginWithEmailAndPassword(email, password),
    {
      onSuccess: (data: AuthResponse) => {
        queryClient.setQueryData(userQueryKey, data.role);
        onSuccess?.();
      },
    },
  );
};

export const useLogout = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation(logout, {
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: userQueryKey });
      onSuccess?.();
    },
  });
};

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(5, 'Required'),
});
