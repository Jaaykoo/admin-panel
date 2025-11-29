import { z } from 'zod';
import {UserSchema} from "@/schemas/UserSchemas";

// Énumération des statuts de devis
export const quoteStatusEnum = z.enum([
  'DRAFT',
  'SUBMITTED',
  'RESPONDED',
  'ACCEPTED',
  'REFUSED',
  'EXPIRED',
]);

// Schéma pour un article de devis (QuoteItem)
export const quoteItemSchema = z.object({
  id: z.number().optional(),
  quote: z.number().optional(),
  product: z.number().min(1, 'Le produit est requis'),
  quantity: z.number().min(1, 'La quantité doit être au moins 1'),
  unit_price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Format de prix invalide (ex: 99.99)')
    .optional(),
  rate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Format de taux invalide (ex: 10.00)')
    .default('0.00'),
  subtotal: z.string().optional(),
});

// Schéma pour la création d'un devis
export const createQuoteSchema = z.object({
  customer: z.number().min(1, 'Le client est requis'),
  message: z
    .string()
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères')
    .optional(),
  expiration_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .refine((date) => {
      const d = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }, 'La date d\'expiration doit être dans le futur'),
  status: quoteStatusEnum.optional(),
  items: z
    .array(quoteItemSchema)
    .min(1, 'Au moins un article est requis')
    .refine(
      items => items.every(item => item.quantity > 0),
      'Toutes les quantités doivent être supérieures à 0',
    ),
});

// Schéma pour les items de mise à jour
const updateQuoteItemSchema = z.object({
  id: z.number().optional(),
  quote: z.number().optional(),
  product: z.number().min(1, 'Le produit est requis'),
  quantity: z.number().min(1, 'La quantité doit être au moins 1'),
  unit_price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Format de prix invalide (ex: 99.99)')
    .optional(),
  rate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Format de taux invalide (ex: 10.00)'),
  subtotal: z.string().optional(),
});

// Schéma pour la modification d'un devis
export const updateQuoteSchema = z.object({
  customer: z.number().min(1).optional(),
  message: z.string().max(1000).optional(),
  expiration_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide')
    .optional(),
  status: quoteStatusEnum.optional(),
  items: z.array(updateQuoteItemSchema).optional(),
  response_note: z.string().max(1000).optional(),
});

// Schéma pour répondre à un devis (endpoint /respond/)
export const respondToQuoteSchema = z.object({
  message: z
    .string()
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères')
    .optional(),
  expiration_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide')
    .optional(),
  items: z
    .array(
      z.object({
        id: z.number(),
        unit_price: z
          .string()
          .regex(/^\d+(\.\d{1,2})?$/, 'Format de prix invalide'),
        rate: z
          .string()
          .regex(/^\d+(\.\d{1,2})?$/, 'Format de taux invalide')
          .optional(),
      }),
    )
    .min(1, 'Au moins un article avec prix est requis')
    .refine(
      items => items.every(item => Number.parseFloat(item.unit_price) > 0),
      'Tous les prix unitaires doivent être supérieurs à 0',
    ),
});

// Schéma pour les items avec détails produit dans un devis
const quoteItemWithDetailSchema = z.object({
  id: z.number(),
  quote: z.number(),
  product_detail: z.object({
    id: z.number(),
    title: z.string(),
    price: z.string(),
    upc: z.string().optional(),
    code: z.string().optional(),
    images: z
      .array(
        z.object({
          original: z.string(),
          caption: z.string().optional(),
        }),
      )
      .optional(),
  }),
  title: z.string(),
  image: z.string().optional(),
  quantity: z.number(),
  unit_price: z.string(),
  rate: z.string(),
  subtotal: z.string(),
});

// Schéma pour les détails d'un devis (réponse API)
export const quoteDetailSchema = z.object({
  id: z.number(),
  quote_number: z.string(),
  customer: UserSchema,
  message: z.string(),
  status: quoteStatusEnum,
  total: z.number(),
  response_note: z.string(),
  responded_at: z.string().optional().nullable(),
  expiration_date: z.string().nullable().optional(),
  created: z.string(),
  modified: z.string(),
  items: z.array(quoteItemWithDetailSchema),
});

// Schéma pour la liste des devis (version résumée)
export const quoteListSchema = z.object({
  id: z.number(),
  quote_number: z.string(),
  customer_company_name: z.string(),
  status: quoteStatusEnum,
  total: z.string(),
  expiration_date: z.string().nullable(),
  created: z.string(),
  items_count: z.number().optional(),
});

// Schéma pour les statistiques des devis
export const quotesStatsSchema = z.object({
  total: z.number(),
  draft: z.number(),
  submitted: z.number(),
  responded: z.number(),
  accepted: z.number(),
  refused: z.number(),
  expired: z.number(),
  acceptance_rate: z.number(),
});

// Schéma pour les filtres de recherche
export const quoteFiltersSchema = z.object({
  search: z.string().optional(),
  status: quoteStatusEnum.optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  ordering: z.string().optional(),
});
