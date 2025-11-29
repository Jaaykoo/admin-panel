import type { CustomersNew, KpiBar, KpiDonut, OrdersMonth, ProductDeliveries, RecentOrders, SalesLineChart, UsersStatistics } from '@/types/AnalyticType';
import { cookies } from 'next/headers';
import { api, attachCookie } from '@/libs/api-client';

export const getKpiBar = async (): Promise<KpiBar> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  return api.get('/analytics/dashboard/kpi-bars/', attachCookie(cookie));
};

export const getKpiDonut = async (): Promise<KpiDonut> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  return api.get('/analytics/dashboard/kpi-donut/', attachCookie(cookie));
};

export const getOrdersMonth = async (): Promise<OrdersMonth> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  return api.get('/analytics/dashboard/orders-month/', attachCookie(cookie));
};

export const getCustomersNew = async (): Promise<CustomersNew> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  return api.get('/analytics/dashboard/customers-new/', attachCookie(cookie));
};

export const getSalesLineChart = async (periodDays: number = 30): Promise<SalesLineChart> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  return api.get(`/analytics/dashboard/sales-line-chart/?period_days=${periodDays}`, attachCookie(cookie));
};

export const getRecentOrders = async (limit: number = 10): Promise<RecentOrders> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  return api.get(`/analytics/dashboard/recent-orders/?limit=${limit}`, attachCookie(cookie));
};

export const getProductDeliveries = async (limit: number = 10): Promise<ProductDeliveries> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  return api.get(`/analytics/dashboard/product-delivery/?limit=${limit}`, attachCookie(cookie));
};

export const getUsersStatistics = async (role?: 'PARTICULIER' | 'ENTREPRISE'): Promise<UsersStatistics> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  const url = role
    ? `/analytics/dashboard/users-statistics/?role=${role}`
    : '/analytics/dashboard/users-statistics/';
  return api.get(url, attachCookie(cookie));
};
