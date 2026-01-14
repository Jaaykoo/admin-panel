// Types TypeScript dérivés des schémas
import type { z } from 'zod';
import type {
  FicheTechniqueSchema,
  ProductAttributeSchema,
  ProductCreateSchema,
  ProductDetailSchema,
  ProductImageSchema,
  ProductOptionSchema,
  ProductUpdateSchema,
  StockRecordSchema,
} from '@/schemas/ProductSchemas';

export type ProductDetail = z.infer<typeof ProductDetailSchema>;
export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
export type ProductImage = z.infer<typeof ProductImageSchema>;
export type ProductAttribute = z.infer<typeof ProductAttributeSchema>;
export type ProductOption = z.infer<typeof ProductOptionSchema>;
export type StockRecord = z.infer<typeof StockRecordSchema>;
export type FicheTechnique = z.infer<typeof FicheTechniqueSchema>;

export type ProductList = {
  url: string;
  id: number;
  title: string;
  description: string;
  slug: string;
  price: string;
  code?: string;
  upc?: string;
  is_public?: boolean;
  images: ProductImage[];
};
