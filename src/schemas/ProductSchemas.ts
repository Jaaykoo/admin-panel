import { z } from 'zod';

// Schéma pour les attributs
export const ProductAttributeSchema = z.object({
  name: z.string(),
  value: z.string(),
  code: z.string(),
});

// Schéma pour les options
export const ProductOptionSchema = z.object({
  url: z.string().optional(),
  code: z.string(),
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  help_text: z.string().optional(),
  order: z.number().optional(),
  option_group: z.string().optional(),
});

// Schéma pour les stockrecords (version complète)
export const StockRecordSchema = z.object({
  price_currency: z.string().default('XOF'),
  price: z.string(),
  num_in_stock: z.number(),
  num_allocated: z.number().nullable().optional(),
  low_stock_threshold: z.number().nullable().optional(),
  date_created: z.string().optional(),
  date_updated: z.string().optional(),
});

// Schéma pour les images
export const ProductImageSchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  original: z.string(),
  caption: z.string().optional(),
  display_order: z.number().optional(),
  date_created: z.string().optional(),
});

// Schéma pour les fiches techniques
export const FicheTechniqueContentSchema = z.object({
  name: z.string(),
  value: z.string(),
});
export const FicheTechniqueSchema = z.object({
  titre: z.string(),
  content: z.array(FicheTechniqueContentSchema),
});

// Schéma principal du produit (version complète)
export const ProductDetailSchema = z.object({
  id: z.number().optional(),
  attributes: z.array(ProductAttributeSchema).optional(),
  categories: z.array(z.string()).optional(),
  product_class: z.string().optional(),
  options: z.array(ProductOptionSchema).optional(),
  recommended_products: z.array(z.string()).optional(),
  url: z.string().optional(),
  stockrecords: StockRecordSchema,
  images: z.array(ProductImageSchema).optional(),
  children: z.array(z.string()).optional(),
  fiche_techniques: z.array(FicheTechniqueSchema).optional(),
  structure: z.string().default('standalone'),
  is_public: z.boolean().default(true),
  upc: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  priority: z.number().optional(),
  rating: z.number().optional(),
  date_created: z.string().optional(),
  date_updated: z.string().optional(),
  is_discountable: z.boolean().optional(),
  code: z.string().optional(),
  parent: z.number().optional(),
});

// Schéma pour l'input (création/modification)
export const ProductCreateSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  description: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  structure: z.string().default('standalone'),
  is_public: z.boolean().default(true),
  upc: z.string().optional(),
  code: z.string().optional(),
  priority: z.number().optional(),
  is_discountable: z.boolean().default(true),
  parent: z.number().optional(),
  categories: z.array(z.string()).default([]),
  product_class: z.string().optional(),
  attributes: z.array(ProductAttributeSchema).default([]),
  options: z.array(ProductOptionSchema).optional(),
  recommended_products: z.array(z.string()).optional(),
  stockrecords: StockRecordSchema,
  images: z.array(ProductImageSchema).default([]),
  fiche_techniques: z.array(FicheTechniqueSchema).default([]),
});
export const ProductUpdateSchema = ProductCreateSchema.partial();
