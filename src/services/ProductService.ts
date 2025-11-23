import type { AxiosResponse } from 'axios';
import type { ID, PaginationResponse } from '@/types/_types';
import type { ProductCreate, ProductDetail, ProductList, ProductUpdate } from '@/types/ProductTypes';
import { api } from '@/libs/api-client';

const PRODUCT_URL = '/admin/catalogue/products/';

// GET - Liste des produits avec pagination
export const getProducts = (query?: string): Promise<PaginationResponse<ProductList>> => {
  return api
    .get(`${PRODUCT_URL}${query ? `?${query}` : ''}`);
};

// GET - Détail d'un produit par ID
export const getProductById = (id: ID): Promise<ProductDetail> => {
  return api
    .get<ProductDetail>(`${PRODUCT_URL}${id}/`)
    .then();
};

// POST - Créer un produit
export const createProduct = (data: ProductCreate): Promise<ProductDetail> => {
  return api
    .post<ProductDetail>(PRODUCT_URL, data)
    .then((res: AxiosResponse<ProductDetail>) => res.data);
};

// PUT - Mettre à jour un produit
export const updateProduct = (id: ID, data: ProductUpdate): Promise<ProductDetail> => {
  return api
    .patch<ProductDetail>(`${PRODUCT_URL}${id}/`, data)
    .then((res: AxiosResponse<ProductDetail>) => res.data);
};

// DELETE - Supprimer un produit
export const deleteProduct = (id: ID): Promise<void> => {
  return api
    .delete(`${PRODUCT_URL}${id}/`)
    .then((res: AxiosResponse<void>) => res.data);
};
