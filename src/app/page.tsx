import type { KpiBarCardProps } from '@/components/dashboard/KpiBarCard';
import type { KpiPieCardProps, KpiPieCategory } from '@/components/dashboard/KpiPieCard';
import type { CustomerRole, NewCustomersCardProps } from '@/components/dashboard/NewCustomersCard';
import type { OrdersThisMonthProps } from '@/components/dashboard/OrdersThisMonthCard';
import { PieChartIcon } from 'lucide-react';
import { KpiBarCard } from '@/components/dashboard/KpiBarCard';
import { KpiPieCard } from '@/components/dashboard/KpiPieCard';
import { NewCustomersCard } from '@/components/dashboard/NewCustomersCard';
import { OrdersThisMonthCard } from '@/components/dashboard/OrdersThisMonthCard';
import { ProductDeliveryCardWrapper } from '@/components/dashboard/ProductDeliveryCardWrapper';
import { RecentOrdersCard } from '@/components/dashboard/RecentOrdersCard';
import { SalesLineChartWrapper } from '@/components/dashboard/SalesLineChartWrapper';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { getCustomersNew, getKpiBar, getKpiDonut, getOrdersMonth, getProductDeliveries, getRecentOrders, getSalesLineChart } from '@/services/AnalyticService';

// Palette de couleurs pour les catégories
const CATEGORY_COLORS = ['#009ef7', '#50cd89', '#ffc700', '#7239ea', '#f1416c'];

export default async function DashboardPage() {
  // Récupération des données depuis l'API pour la ligne 1 avec gestion d'erreur
  let salesByCategoryData: KpiPieCardProps;
  let monthlyRevenueData: KpiBarCardProps;

  try {
    const [salesByCategoryResponse, weeklyRevenueResponse] = await Promise.all([
      getKpiDonut(),
      getKpiBar(),
    ]);

    // Transformation des données pour KpiPieCard
    salesByCategoryData = {
      title: salesByCategoryResponse.title,
      mainValue: salesByCategoryResponse.mainValue,
      variation: salesByCategoryResponse.variation,
      categories: salesByCategoryResponse.categories.map((cat, index): KpiPieCategory => ({
        label: cat.label,
        value: cat.value,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length] || '#009ef7',
      })),
    };

    // Transformation des données pour KpiBarCard
    monthlyRevenueData = {
      title: weeklyRevenueResponse.title,
      mainValue: weeklyRevenueResponse.mainValue,
      variation: weeklyRevenueResponse.variation,
      bars: weeklyRevenueResponse.bars,
      labels: weeklyRevenueResponse.labels,
      barColor: '#009ef7',
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données analytics:', error);
    console.error('Détails erreur:', {
      status: error?.response?.status,
      message: error?.message,
      url: error?.config?.url,
    });

    // Données par défaut en cas d'erreur
    salesByCategoryData = {
      title: 'Ventes par catégorie (Données non disponibles)',
      mainValue: 0,
      variation: 0,
      categories: [
        { label: 'Aucune donnée disponible', value: 1, color: '#009ef7' },
      ],
    };

    monthlyRevenueData = {
      title: 'Revenus hebdomadaires (Données non disponibles)',
      mainValue: 0,
      variation: 0,
      bars: [0, 0, 0, 0, 0, 0, 0],
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      barColor: '#009ef7',
    };
  }

  // LIGNE 2 - KPI Secondaires - Récupération depuis l'API
  let ordersThisMonthData: OrdersThisMonthProps;
  let newCustomersData: NewCustomersCardProps;

  try {
    const [ordersMonthResponse, customersNewResponse] = await Promise.all([
      getOrdersMonth(),
      getCustomersNew(),
    ]);

    // Transformation des données pour OrdersThisMonthCard
    ordersThisMonthData = {
      title: ordersMonthResponse.title,
      value: ordersMonthResponse.value,
      variation: ordersMonthResponse.variation,
      goal: ordersMonthResponse.goal,
    };

    // Transformation des données pour NewCustomersCard
    newCustomersData = {
      title: customersNewResponse.title,
      value: customersNewResponse.value,
      roles: customersNewResponse.roles.map((role): CustomerRole => ({
        label: role.label,
        value: role.value,
      })),
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données ligne 2:', error);
    console.error('Détails erreur:', {
      status: error?.response?.status,
      message: error?.message,
      url: error?.config?.url,
    });

    // Données par défaut en cas d'erreur
    ordersThisMonthData = {
      title: 'Commandes ce mois (Données non disponibles)',
      value: 0,
      variation: 0,
      goal: {
        current: 0,
        target: 100,
      },
    };

    newCustomersData = {
      title: 'Nouveaux clients (Données non disponibles)',
      value: 0,
      roles: [
        { label: 'Particuliers', value: 0 },
        { label: 'Entreprises', value: 0 },
      ],
    };
  }

  // LIGNE 3 - Grand Chart - Récupération depuis l'API
  let salesLineChartData: {
    title: string;
    value: number;
    objectiveMessage: string;
    labels: string[];
    dataset: number[];
  };

  try {
    const salesLineChartResponse = await getSalesLineChart(28); // Par défaut 28 jours

    salesLineChartData = {
      title: salesLineChartResponse.title,
      value: salesLineChartResponse.value,
      objectiveMessage: salesLineChartResponse.objectiveMessage,
      labels: salesLineChartResponse.labels,
      dataset: salesLineChartResponse.dataset,
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données ligne 3:', error);
    console.error('Détails erreur:', {
      status: error?.response?.status,
      message: error?.message,
      url: error?.config?.url,
    });

    // Données par défaut en cas d'erreur
    salesLineChartData = {
      title: 'Sales This Month (Données non disponibles)',
      value: 0,
      objectiveMessage: 'Target: $0',
      labels: [],
      dataset: [],
    };
  }

  // LIGNE 4 - Recent Orders - Récupération depuis l'API
  let recentOrdersData: {
    orders: Array<{
      orderNumber: string;
      customerName: string;
      status: string;
      totalPrice: number;
      orderDate: string;
    }>;
  };

  try {
    const recentOrdersResponse = await getRecentOrders(10); // Par défaut 10 commandes

    recentOrdersData = {
      orders: recentOrdersResponse.orders,
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données ligne 4:', error);
    console.error('Détails erreur:', {
      status: error?.response?.status,
      message: error?.message,
      url: error?.config?.url,
    });

    // Données par défaut en cas d'erreur
    recentOrdersData = {
      orders: [],
    };
  }

  // LIGNE 6 - Product Delivery - Récupération depuis l'API
  let productDeliveryData: {
    itemsShipped: number;
    deliveries: Array<{
      productName: string;
      recipientName: string;
      deliveryDate: string;
    }>;
  };

  try {
    const productDeliveryResponse = await getProductDeliveries(10); // Par défaut 10 livraisons

    productDeliveryData = {
      itemsShipped: productDeliveryResponse.itemsShipped,
      deliveries: productDeliveryResponse.deliveries,
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données ligne 6:', error);
    console.error('Détails erreur:', {
      status: error?.response?.status,
      message: error?.message,
      url: error?.config?.url,
    });

    // Données par défaut en cas d'erreur
    productDeliveryData = {
      itemsShipped: 0,
      deliveries: [],
    };
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8 flex items-center gap-3">
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
              <SalesLineChartWrapper initialData={salesLineChartData} />
            </div>

            {/* LIGNE 4 - Recent Orders */}
            <div className="mb-6">
              <RecentOrdersCard orders={recentOrdersData.orders} />
            </div>

            {/* LIGNE 6 - Product Delivery Timeline */}
            <div className="mb-6">
              <ProductDeliveryCardWrapper
                itemsShipped={productDeliveryData.itemsShipped}
                deliveries={productDeliveryData.deliveries}
              />
            </div>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
