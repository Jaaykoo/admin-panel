import type { ID, PaginationResponse } from '@/types/_types';
import type {
  OrderDetail,
  OrderLine,
  OrderLineAttribute,
  OrderLineUpdate,
  OrderList,
  OrdersStats,
  OrderUpdate,
} from '@/types/OrderTypes';
import { api } from '@/libs/api-client';

const ORDERS_URL = '/admin/orders/';
const ORDER_LINES_URL = '/admin/orders/orderlines/';
const ORDER_LINE_ATTRIBUTES_URL = '/admin/orders/orderlineattributes/';
const ORDERS_STATS_URL = '/analytics/admin/orders-stats/';

// ==================== ORDERS ====================

// GET - Liste des commandes avec pagination et filtres
export function getOrders(queryString: string): Promise<PaginationResponse<OrderList>> {
  return api.get(`${ORDERS_URL}${queryString ? `?${queryString}` : ''}`);
}

// GET - Détail d'une commande par ID
export function getOrderById(id: ID): Promise<OrderDetail> {
  return api
    .get<OrderDetail>(`${ORDERS_URL}${id}/`)
    .then();
}

// PUT - Mettre à jour une commande
export function updateOrder(id: ID, data: OrderUpdate): Promise<OrderDetail> {
  return api
    .patch<OrderDetail>(`${ORDERS_URL}${id}/`, data)
    .then();
}

// DELETE - Supprimer une commande
export function deleteOrder(id: ID): Promise<void> {
  return api
    .delete(`${ORDERS_URL}${id}/`)
    .then();
}

// GET - Lignes d'une commande
export function getOrderLines(orderId: ID): Promise<PaginationResponse<OrderLine>> {
  return api.get(`${ORDERS_URL}${orderId}/lines/`);
}

// ==================== ORDER LINES ====================

// GET - Détail d'une ligne de commande
export function getOrderLineById(id: ID): Promise<OrderLine> {
  return api
    .get<OrderLine>(`${ORDER_LINES_URL}${id}/`)
    .then();
}

// PUT - Mettre à jour une ligne de commande
export function updateOrderLine(id: ID, data: OrderLineUpdate): Promise<OrderLine> {
  return api
    .patch<OrderLine>(`${ORDER_LINES_URL}${id}/`, data)
    .then();
}

// DELETE - Supprimer une ligne de commande
export function deleteOrderLine(id: ID): Promise<void> {
  return api
    .delete(`${ORDER_LINES_URL}${id}/`)
    .then();
}

// ==================== ORDER LINE ATTRIBUTES ====================

// GET - Détail d'un attribut de ligne
export function getOrderLineAttributeById(id: ID): Promise<OrderLineAttribute> {
  return api
    .get<OrderLineAttribute>(`${ORDER_LINE_ATTRIBUTES_URL}${id}/`)
    .then();
}

// DELETE - Supprimer un attribut de ligne
export function deleteOrderLineAttribute(id: ID): Promise<void> {
  return api
    .delete(`${ORDER_LINE_ATTRIBUTES_URL}${id}/`)
    .then();
}

// ==================== ANALYTICS ====================

// GET - Statistiques des commandes
export function getOrdersStats(): Promise<OrdersStats> {
  return api
    .get<OrdersStats>(ORDERS_STATS_URL)
    .then();
}

// DELETE - Supprimer plusieurs commandes
export const deleteSelectedOrders = (
  ids: ID[],
): Promise<void> => {
  return Promise.all(ids.map(id => api.delete(`${ORDERS_URL}${id}/`))).then(
    () => {},
  );
};

// ==================== EXPORTS ====================

export const OrderService = {
  // Orders
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  deleteSelectedOrders,
  getOrderLines,

  // Order Lines
  getOrderLineById,
  updateOrderLine,
  deleteOrderLine,

  // Order Line Attributes
  getOrderLineAttributeById,
  deleteOrderLineAttribute,

  // Analytics
  getOrdersStats,
};

export default OrderService;
