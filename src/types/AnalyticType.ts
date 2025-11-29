export type KpiBar = {
  title: string;
  mainValue: number;
  variation: number;
  bars: number[];
  labels: string[];
};

type Category = {
  label: string;
  value: number;
};

export type KpiDonut = {
  title: string;
  mainValue: number;
  variation: number;
  categories: Category[];
};

// Ligne 2 - Commandes du mois
export type OrdersMonth = {
  title: string;
  value: number;
  variation: number;
  goal: {
    current: number;
    target: number;
  };
};

// Ligne 2 - Nouveaux clients
type Role = {
  label: string;
  value: number;
};

export type CustomersNew = {
  title: string;
  value: number;
  avatars: string[];
  roles: Role[];
};

// Ligne 3 - Sales Line Chart
export type SalesLineChart = {
  title: string;
  value: number;
  objectiveMessage: string;
  labels: string[];
  dataset: number[];
};

// Ligne 4 - Recent Orders
export type RecentOrder = {
  orderNumber: string;
  customerName: string;
  status: string;
  totalPrice: number;
  orderDate: string;
};

export type RecentOrders = {
  orders: RecentOrder[];
};

// Ligne 6 - Product Delivery
export type ProductDelivery = {
  productName: string;
  recipientName: string;
  deliveryDate: string;
};

export type ProductDeliveries = {
  itemsShipped: number;
  deliveries: ProductDelivery[];
};

// Users Statistics - KPIs pour les tables utilisateurs
export type UsersStatistics = {
  total: number;
  active: number;
  verified: number;
  inactive: number;
  role?: string;
};
