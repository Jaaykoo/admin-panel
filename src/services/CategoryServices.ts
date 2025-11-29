import type { AxiosResponse } from 'axios';
import type { ID, PaginationResponse } from '@/types/_types';
import type { Category, CreateCategory, UpdateCategory } from '@/types/CategoryTypes';
import { api } from '@/libs/api-client';

const CATEGORY_URL = `admin/catalogue/categories/`;

export const getCategories = (
  query: string,
): Promise<PaginationResponse<Category>> => {
  return api
    .get<PaginationResponse<Category>>(`${CATEGORY_URL}?${query}`)
    .then(res => res as PaginationResponse<Category>);
};

export const getCategoryById = (id: ID): Promise<Category | undefined> => {
  return api.get(`${CATEGORY_URL}${id}/`).then();
};

export const createCategory = (
  payload: CreateCategory,
): Promise<Category | undefined> => {
  return api
    .post(`${CATEGORY_URL}`, payload)
    .then((response: AxiosResponse<Category>) => response.data);
};

export const createSubCategory = (
  parentSlugsPath: string,
  payload: CreateCategory,
): Promise<Category | undefined> => {
  // Le backend attend l'URL avec les SLUGS des parents (pas les breadcrumbs)
  // Exemple: POST /categories/ordinateurs-tablettes/ pour créer une sous-catégorie
  // Exemple: POST /categories/ordinateurs-tablettes/tablettes/ pour créer une sous-sous-catégorie
  // parentSlugsPath doit être construit avec les slugs: "parent-slug/enfant-slug"
  return api
    .post(`${CATEGORY_URL}${parentSlugsPath}/`, payload)
    .then((response: AxiosResponse<Category>) => response.data);
};

export const updateCategory = (
  id: ID,
  payload: UpdateCategory,
): Promise<Category | undefined> => {
  return api
    .patch(`${CATEGORY_URL}${id}/`, payload)
    .then((response: AxiosResponse<Category>) => response.data);
};

export const deleteCategory = (id: ID): Promise<number> => {
  return api.delete(`${CATEGORY_URL}${id}/`).then(res => res.status);
};

export const deleteSelectedCategories = (
  ids: ID[],
): Promise<void> => {
  return Promise.all(ids.map(id => api.delete(`${CATEGORY_URL}${id}/`))).then(
    () => {},
  );
};
