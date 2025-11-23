import { z } from 'zod';

// Énumération des statuts de commande
export const OrderStatusEnum = z.enum([
  'Pending',
  'Payment Declined',
  'Authorized',
  'Shipped',
  'Canceled',
  'new',
]);

// Schéma pour les adresses inline
export const InlineBillingAddressSchema = z.object({
  id: z.number().optional(),
  title: z.string().optional(),
  first_name: z.string(),
  last_name: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  line3: z.string().optional(),
  line4: z.string(),
  state: z.string().optional(),
  postcode: z.string(),
  country: z.string(),
  phone_number: z.string().optional(),
});

export const InlineShippingAddressSchema = InlineBillingAddressSchema;

// Schéma pour les surcharges
export const InlineSurchargeSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  code: z.string(),
  incl_tax: z.string(),
  excl_tax: z.string(),
});

// Schéma pour les attributs de ligne de commande
export const OrderLineAttributeSchema = z.object({
  id: z.number().optional(),
  url: z.string().optional(),
  type: z.string(),
  value: z.string(),
  option: z.string().nullable().optional(),
  line: z.string().optional(),
});

// Schéma pour le produit dans une ligne de commande (simplifié)
export const OrderProductSchema = z.object({
  id: z.number(),
  url: z.string().optional(),
  title: z.string(),
  slug: z.string().optional(),
  upc: z.string().nullable().optional(),
  description: z.string().optional(),
  structure: z.string().optional(),
  images: z.array(z.object({
    original: z.string(),
    caption: z.string().optional(),
  })).optional(),
  price: z.string().optional(),
});

// Schéma pour une ligne de commande
export const OrderLineSchema = z.object({
  id: z.number().optional(),
  url: z.string().optional(),
  product: OrderProductSchema,
  stockrecord: z.string(),
  quantity: z.number().min(1, 'La quantité doit être au moins 1'),
  price_currency: z.string().default('XOF'),
  price_excl_tax: z.string(),
  price_incl_tax: z.string(),
  price_incl_tax_excl_discounts: z.string(),
  price_excl_tax_excl_discounts: z.string(),
  order: z.string().optional(),
  attributes: z.array(OrderLineAttributeSchema).optional(),
});

// Schéma principal de commande (lecture)
export const OrderDetailSchema = z.object({
  id: z.number().optional(),
  number: z.string(),
  basket: z.string().nullable().optional(),
  url: z.string().optional(),
  lines: z.array(OrderLineSchema),
  owner: z.string().optional(),
  billing_address: InlineBillingAddressSchema.nullable().optional(),
  currency: z.string().default('XOF'),
  total_incl_tax: z.string(),
  total_excl_tax: z.string(),
  shipping_incl_tax: z.string().optional(),
  shipping_excl_tax: z.string().optional(),
  shipping_address: InlineShippingAddressSchema.nullable().optional(),
  shipping_method: z.string().optional(),
  shipping_code: z.string().optional(),
  status: OrderStatusEnum,
  email: z.string().email().optional(),
  date_placed: z.string().optional(),
  payment_url: z.string().optional(),
  offer_discounts: z.string().optional(),
  voucher_discounts: z.string().optional(),
  surcharges: z.array(InlineSurchargeSchema).optional(),
});

// Schéma pour la liste des commandes (version simplifiée)
export const OrderListSchema = z.object({
  id: z.number(),
  number: z.string(),
  url: z.string().optional(),
  status: OrderStatusEnum,
  total_incl_tax: z.string(),
  total_excl_tax: z.string(),
  email: z.string().email().optional(),
  date_placed: z.string(),
  owner: z.string().optional(),
  lines_count: z.number().optional(),
});

// Schéma pour créer une commande
export const OrderCreateSchema = z.object({
  basket: z.string().optional(),
  guest_email: z.string().email().optional(),
  total: z.string().optional(),
  shipping_method_code: z.string().optional(),
  shipping_address: InlineShippingAddressSchema.optional(),
  billing_address: InlineBillingAddressSchema.optional(),
});

// Schéma pour mettre à jour une commande
export const OrderUpdateSchema = z.object({
  status: OrderStatusEnum.optional(),
  shipping_method: z.string().optional(),
  shipping_code: z.string().optional(),
  billing_address: InlineBillingAddressSchema.optional(),
  shipping_address: InlineShippingAddressSchema.optional(),
  currency: z.string().optional(),
}).partial();

// Schéma pour mettre à jour une ligne de commande
export const OrderLineUpdateSchema = z.object({
  quantity: z.number().min(1).optional(),
  price_excl_tax: z.string().optional(),
  price_incl_tax: z.string().optional(),
}).partial();

// Schéma pour les statistiques de commandes
export const OrdersStatsSchema = z.object({
  total_orders: z.number(),
  total_revenue: z.string(),
  average_order_value: z.string(),
  status_breakdown: z.object({
    pending: z.number(),
    authorized: z.number(),
    shipped: z.number(),
    canceled: z.number(),
    payment_declined: z.number(),
  }),
});
