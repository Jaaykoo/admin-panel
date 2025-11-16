import type { AxiosResponse } from 'axios';
import type { ID, PaginationResponse } from '@/types/_types';
import type { CreateUser, UpdateUser, User } from '@/types/UserTypes';
import { api } from '@/libs/api-client';

const USER_URL = `admin/users/`;

const getUsers = (query: string): Promise<PaginationResponse<User>> => {
  return api
    .get<PaginationResponse<User>>(`${USER_URL}?${query}`)
    .then(res => res as PaginationResponse<User>);
};

const getUserById = (id: ID): Promise<User | undefined> => {
  return api
    .get(`${USER_URL}${id}/`)
    .then();
};

const createUser = (user: CreateUser): Promise<User | undefined> => {
  return api
    .post(`${USER_URL}`, user)
    .then((response: AxiosResponse<User>) => response.data);
};

const updateUser = (id: number, user: UpdateUser): Promise<User | undefined> => {
  return api
    .patch(`${USER_URL}${id}/`, user)
    .then((response: AxiosResponse<User>) => response.data);
};

const deleteUser = (userId: ID): Promise<number> => {
  return api.delete(`${USER_URL}${userId}/`).then(res => res.status);
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map(id => api.delete(`${USER_URL}${id}`));
  return Promise.all(requests).then(() => {});
};

const blockUser = (userId: ID): Promise<number> => {
  return api.post(`${USER_URL}${userId}/activate/`).then(res => res.status);
};

const unblockUser = (userId: ID): Promise<number> => {
  return api.post(`${USER_URL}${userId}/suspend/`).then(res => res.status);
};

export {
  blockUser,
  createUser,
  deleteSelectedUsers,
  deleteUser,
  getUserById,
  getUsers,
  unblockUser,
  updateUser,
};
