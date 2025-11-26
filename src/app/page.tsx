import type { DiscountedSalesProps } from '@/components/dashboard/DiscountedSalesCard';
import type { KpiBarCardProps } from '@/components/dashboard/KpiBarCard';
import type { KpiPieCardProps } from '@/components/dashboard/KpiPieCard';
import type { MarketingCardProps } from '@/components/dashboard/MarketingCard';
import type { NewCustomersCardProps } from '@/components/dashboard/NewCustomersCard';
import type { OrdersThisMonthProps } from '@/components/dashboard/OrdersThisMonthCard';
import type { ProductDeliveryProps } from '@/components/dashboard/ProductDeliveryCard';
import type { ProductOrdersTableProps } from '@/components/dashboard/ProductOrdersTable';
import type { SalesLineChartProps } from '@/components/dashboard/SalesLineChartCard';
import { PieChartIcon } from 'lucide-react';
import { KpiBarCard } from '@/components/dashboard/KpiBarCard';
import { KpiPieCard } from '@/components/dashboard/KpiPieCard';
import { NewCustomersCard } from '@/components/dashboard/NewCustomersCard';
import { OrdersThisMonthCard } from '@/components/dashboard/OrdersThisMonthCard';
import { ProductDeliveryCard } from '@/components/dashboard/ProductDeliveryCard';
import { ProductOrdersTable } from '@/components/dashboard/ProductOrdersTable';
import { SalesLineChartCard } from '@/components/dashboard/SalesLineChartCard';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { RecentOrders } from '@/components/recent-orders';

export default function DashboardPage() {
  // Données pour KpiPieCard - Ventes par catégorie
  const salesByCategoryData: KpiPieCardProps = {
    title: 'Ventes par catégorie',
    mainValue: 45231,
    variation: 12.5,
    categories: [
      { label: 'Électronique', value: 18500, color: '#009ef7' },
      { label: 'Vêtements', value: 12300, color: '#50cd89' },
      { label: 'Alimentation', value: 8900, color: '#ffc700' },
      { label: 'Maison', value: 5531, color: '#7239ea' },
    ],
  };

  // Données pour KpiBarCard - Revenus mensuels
  const monthlyRevenueData: KpiBarCardProps = {
    title: 'Revenus mensuels',
    mainValue: 128450,
    variation: 8.3,
    bars: [45000, 52000, 48000, 61000, 55000, 70000, 65000, 72000, 68000, 75000],
    barColor: '#009ef7',
  };

  // LIGNE 2 - KPI Secondaires
  const ordersThisMonthData: OrdersThisMonthProps = {
    title: 'Commandes ce mois',
    value: 847,
    variation: 15.3,
    goal: {
      current: 847,
      target: 1000,
    },
  };

  const newCustomersData: NewCustomersCardProps = {
    title: 'Nouveaux clients',
    value: 156,
    avatars: [
      'https://ui-avatars.com/api/?name=John+Doe&background=009ef7&color=fff',
      'https://ui-avatars.com/api/?name=Jane+Smith&background=50cd89&color=fff',
      'https://ui-avatars.com/api/?name=Bob+Johnson&background=ffc700&color=fff',
      'https://ui-avatars.com/api/?name=Alice+Williams&background=7239ea&color=fff',
      'https://ui-avatars.com/api/?name=Charlie+Brown&background=f1416c&color=fff',
      'https://ui-avatars.com/api/?name=Emma+Davis&background=009ef7&color=fff',
      'https://ui-avatars.com/api/?name=Michael+Wilson&background=50cd89&color=fff',
    ],
  };

  // LIGNE 3 - Grand Chart
  const salesLineChartData: SalesLineChartProps = {
    title: 'Ventes ce mois',
    value: 3250000,
    objectiveMessage: 'Objectif: 4 000 000 FCFA pour ce mois',
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct'],
    dataset: [120000, 150000, 180000, 200000, 250000, 280000, 300000, 320000, 350000, 380000],
  };

  // LIGNE 4 - Discount Sales
  const discountedSalesData: DiscountedSalesProps = {
    title: 'Ventes avec réduction',
    value: 458900,
    variation: 18.7,
    labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    dataset: [45000, 52000, 48000, 65000, 58000, 72000],
  };

  // LIGNE 5 - Marketing + Product Orders
  const marketingCardData: MarketingCardProps = {
    title: 'Nouvelle application marketing',
    description: 'Découvrez notre nouvelle application pour booster vos ventes et améliorer votre marketing digital.',
    image: 'https://ui-avatars.com/api/?name=App&size=128&background=009ef7&color=fff',
    buttons: [
      { label: 'Voir l\'app', action: 'view-app', variant: 'default' },
      { label: 'Nouveau produit', action: 'new-product', variant: 'outline' },
    ],
  };

  const productOrdersData: ProductOrdersTableProps = {
    filters: {
      categories: ['Électronique', 'Vêtements', 'Alimentation', 'Maison'],
      statuses: ['completed', 'pending', 'cancelled', 'processing'],
    },
    orders: [
      {
        orderId: 'ORD-2025-001',
        createdAt: '26/11/2025',
        customer: 'Jean Dupont',
        total: 125000,
        profit: 35000,
        status: 'completed',
      },
      {
        orderId: 'ORD-2025-002',
        createdAt: '26/11/2025',
        customer: 'Marie Martin',
        total: 89000,
        profit: 22000,
        status: 'processing',
      },
      {
        orderId: 'ORD-2025-003',
        createdAt: '25/11/2025',
        customer: 'Pierre Dubois',
        total: 156000,
        profit: 45000,
        status: 'pending',
      },
      {
        orderId: 'ORD-2025-004',
        createdAt: '25/11/2025',
        customer: 'Sophie Laurent',
        total: 234000,
        profit: 67000,
        status: 'completed',
      },
      {
        orderId: 'ORD-2025-005',
        createdAt: '24/11/2025',
        customer: 'Luc Bernard',
        total: 45000,
        profit: 12000,
        status: 'cancelled',
      },
    ],
  };

  // LIGNE 6 - Product Delivery
  const productDeliveryData: ProductDeliveryProps = {
    itemsShipped: 234,
    deliveries: [
      {
        item: 'HP ProBook 450 G9 - Lot de 5 unités',
        recipient: 'Entreprise Tech Solutions',
        status: 'delivered',
        date: '26/11/2025 10:30',
      },
      {
        item: 'Samsung Galaxy S23 - Lot de 10 unités',
        recipient: 'Store Mobile Plus',
        status: 'shipped',
        date: '26/11/2025 09:15',
      },
      {
        item: 'MacBook Air M2 - 3 unités',
        recipient: 'Digital Agency Co.',
        status: 'processing',
        date: '26/11/2025 08:00',
      },
      {
        item: 'Dell XPS 15 - 2 unités',
        recipient: 'Startup Innovation',
        status: 'pending',
        date: '25/11/2025 16:45',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#009ef7] to-[#0077b6] text-white shadow-lg">
                <PieChartIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-sm text-gray-500">Voilà ce qui se passe dans votre entreprise aujourd'hui</p>
              </div>
            </div>

            {/* KPI Cards Row - Ligne 1 */}
            <div className="mb-6 grid gap-6 lg:grid-cols-2">
              <KpiPieCard {...salesByCategoryData} />
              <KpiBarCard {...monthlyRevenueData} />
            </div>

            {/* LIGNE 2 - KPI Secondaires */}
            <div className="mb-6 grid gap-6 lg:grid-cols-2">
              <OrdersThisMonthCard {...ordersThisMonthData} />
              <NewCustomersCard {...newCustomersData} />
            </div>

            {/* LIGNE 3 - Grand Chart des Ventes */}
            <div className="mb-6">
              <SalesLineChartCard {...salesLineChartData} />
            </div>

            {/* LIGNE 4 - Recent Orders + Discounted Sales */}
            <div className="mb-6">
              <RecentOrders />
            </div>

            {/* LIGNE 5 - Marketing Card + Product Orders Table */}
            <div className="mb-6 ">
              <ProductOrdersTable {...productOrdersData} />
            </div>

            {/* LIGNE 6 - Product Delivery Timeline */}
            <div className="mb-6">
              <ProductDeliveryCard {...productDeliveryData} />
            </div>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
