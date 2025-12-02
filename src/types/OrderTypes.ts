// Types TypeScript pour les commandes
import type { z } from 'zod';
import type {
  InlineBillingAddressSchema,
  InlineShippingAddressSchema,
  OrderCreateSchema,
  OrderDetailSchema,
  OrderLineAttributeSchema,
  OrderLineSchema,
  OrderLineUpdateSchema,
  OrderListSchema,
  OrdersStatsSchema,
  OrderStatusEnum,
  OrderUpdateSchema,
} from '@/schemas/OrderSchemas';

// Types dérivés des schémas Zod
export type OrderStatus = z.infer<typeof OrderStatusEnum>;
export type OrderDetail = z.infer<typeof OrderDetailSchema>;
export type OrderList = z.infer<typeof OrderListSchema>;
export type OrderCreate = z.infer<typeof OrderCreateSchema>;
export type OrderUpdate = z.infer<typeof OrderUpdateSchema>;
export type OrderLine = z.infer<typeof OrderLineSchema>;
export type OrderLineUpdate = z.infer<typeof OrderLineUpdateSchema>;
export type OrderLineAttribute = z.infer<typeof OrderLineAttributeSchema>;
export type OrdersStats = z.infer<typeof OrdersStatsSchema>;
export type InlineBillingAddress = z.infer<typeof InlineBillingAddressSchema>;
export type InlineShippingAddress = z.infer<typeof InlineShippingAddressSchema>;

// Type pour les options de statut (pour les sélecteurs)
export type OrderStatusOption = {
  value: OrderStatus;
  label: string;
  color: 'default' | 'success' | 'warning' | 'danger' | 'secondary';
  icon?: string;
};

// Constantes pour les statuts
export const ORDER_STATUS_OPTIONS: OrderStatusOption[] = [
  { value: 'Pending', label: 'En attente', color: 'warning', icon: '🟡' },
  { value: 'Authorized', label: 'Autorisée', color: 'success', icon: '🟢' },
  { value: 'Shipped', label: 'Expédiée', color: 'default', icon: '📦' },
  { value: 'Canceled', label: 'Annulée', color: 'danger', icon: '🔴' },
  { value: 'Payment Declined', label: 'Paiement refusé', color: 'danger', icon: '❌' },
  { value: 'new', label: 'Nouveau', color: 'secondary', icon: '🆕' },
];

// Helper pour obtenir le label d'un statut
export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_OPTIONS.find(opt => opt.value === status)?.label ?? status;
}

// Helper pour obtenir la couleur d'un statut
export function getOrderStatusColor(status: OrderStatus): OrderStatusOption['color'] {
  return ORDER_STATUS_OPTIONS.find(opt => opt.value === status)?.color ?? 'default';
}

// Helper pour obtenir l'icône d'un statut
export function getOrderStatusIcon(status: OrderStatus): string {
  return ORDER_STATUS_OPTIONS.find(opt => opt.value === status)?.icon ?? '📋';
}
