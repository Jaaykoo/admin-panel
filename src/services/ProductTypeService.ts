import type { PaginationResponse } from '@/types/_types';
import type { ProductClass, ProductClassCreate, ProductClassUpdate } from '@/types/ProductClassTypes';
import { api } from '@/libs/api-client';

const PRODUCT_CLASS_URL = `admin/catalogue/productclasses/`;

export const getProductClasses = (
  query: string,
): Promise<PaginationResponse<ProductClass>> => {
  return api.get(`${PRODUCT_CLASS_URL}?${query}`);
};

export const getProductClassBySlug = (
  slug: string,
): Promise<ProductClass> => {
  return api.get(`${PRODUCT_CLASS_URL}${slug}/`);
};

export const createProductClass = (
  payload: ProductClassCreate,
): Promise<ProductClass> => {
  return api.post(`${PRODUCT_CLASS_URL}`, payload);
};

export const updateProductClass = (
  slug: string | null,
  payload: ProductClassUpdate,
): Promise<ProductClass> => {
  return api.patch(`${PRODUCT_CLASS_URL}${slug}/`, payload);
};

export const deleteProductClass = (slug: string): Promise<void> => {
  return api.delete(`${PRODUCT_CLASS_URL}${slug}/`);
};
