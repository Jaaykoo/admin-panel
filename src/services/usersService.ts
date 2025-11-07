import type { AxiosResponse } from 'axios';
import type { ID, PaginationResponse } from '@/types/_types';
import type { User, UserRole } from '@/types/UserTypes';
import axios from 'axios';

const USER_URL = `admin/users/`;

type UserQueryParams = {
  limit?: number;
  offset?: number;
  role?: UserRole;
  search?: string;
};

type BulkUploadResponse = {
  created: number;
  ignored: number;
  errors: string[];
};

const getUsers = (params: UserQueryParams = {}): Promise<PaginationResponse<User>> => {
  const queryParams = new URLSearchParams();

  if (params.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params.offset) {
    queryParams.append('offset', params.offset.toString());
  }
  if (params.role) {
    queryParams.append('role', params.role);
  }
  if (params.search) {
    queryParams.append('search', params.search);
  }

  return axios
    .get(`${USER_URL}?${queryParams.toString()}`)
    .then((d: AxiosResponse<PaginationResponse<User>>) => {
      return d.data;
    });
};

const getUserById = (id: ID): Promise<User | undefined> => {
  return axios
    .get(`${USER_URL}${id}/`)
    .then((response: AxiosResponse<User | undefined>) => {
      return response.data;
    });
};

const createUser = (user: User): Promise<User | undefined> => {
  return axios
    .post(`${USER_URL}create/`, user)
    .then((response: AxiosResponse<User>) => response.data);
};

const updateUser = (id: string, user: User): Promise<User | undefined> => {
  return axios
    .patch(`${USER_URL}${id}/update/`, user)
    .then((response: AxiosResponse<User>) => response.data);
};

const deleteUser = (userId: ID): Promise<number> => {
  return axios.delete(`${USER_URL}${userId}/delete/`).then(res => res.status);
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map(id => axios.delete(`${USER_URL}${id}`));
  return axios.all(requests).then(() => {});
};

function getUserByToken(): Promise<AxiosResponse<User>> {
  return axios.get<User>('users/me');
}

const bulkUploadUsers = (file: File): Promise<BulkUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return axios
    .post(`${USER_URL}bulk-upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response: AxiosResponse<BulkUploadResponse>) => response.data);
};

const blockUser = (userId: ID): Promise<number> => {
  return axios.post(`${USER_URL}${userId}/block/`).then(res => res.status);
};

const unblockUser = (userId: ID): Promise<number> => {
  return axios.post(`${USER_URL}${userId}/unblock/`).then(res => res.status);
};

// Get current user profile
const getCurrentUserProfile = (): Promise<User> => {
  return axios.get('users/me/').then((response: AxiosResponse<User>) => response.data);
};

// Update current user profile with FormData (for avatar upload)
const updateCurrentUserProfile = (id: ID, profileData: FormData): Promise<User> => {
  return axios.patch(`users/profile/${id}/update/`, profileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((response: AxiosResponse<User>) => response.data);
};

export {
  blockUser,
  bulkUploadUsers,
  createUser,
  deleteSelectedUsers,
  deleteUser,
  getCurrentUserProfile,
  getUserById,
  getUserByToken,
  getUsers,
  unblockUser,
  updateCurrentUserProfile,
  updateUser,
};
