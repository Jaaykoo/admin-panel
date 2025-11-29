'use client';

import { useQuery } from '@tanstack/react-query';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { getOrdersStats } from '@/services/OrderService';

export function OrdersStatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: [QUERIES.ORDERS_LIST, 'stats'],
    queryFn: () => getOrdersStats(),
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {['total', 'revenue', 'average', 'pending'].map((key) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="mt-1 h-3 w-48" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Commandes',
      value: stats.total_orders.toString(),
      description: 'Toutes les commandes',
      icon: ShoppingCart,
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Revenu Total',
      value: `${Number(stats.total_revenue).toLocaleString('fr-FR')} FCFA`,
      description: 'Chiffre d\'affaires total',
      icon: DollarSign,
      bgColor: 'bg-green-500',
    },
    {
      title: 'Valeur Moyenne',
      value: `${Number(stats.average_order_value).toLocaleString('fr-FR')} FCFA`,
      description: 'Par commande',
      icon: TrendingUp,
      bgColor: 'bg-purple-500',
    },
    {
      title: 'En Attente',
      value: stats.status_breakdown.pending.toString(),
      description: `${stats.status_breakdown.authorized} autorisées`,
      icon: Package,
      bgColor: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-l-4" style={{ borderLeftColor: stat.bgColor.replace('bg-', '#') }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-full ${stat.bgColor} p-2`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
