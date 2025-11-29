'use client';

import type { RecentOrder } from '@/types/AnalyticType';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type RecentOrdersCardProps = {
  orders: RecentOrder[];
};

const statusColors = {
  Authorized: 'bg-[#e8fff3] text-[#50cd89]',
  Shipped: 'bg-[#fff8dd] text-[#ffc700]',
  Pending: 'bg-[#f8f5ff] text-[#7239ea]',
  Cancelled: 'bg-[#fff5f8] text-[#f1416c]',
  Completed: 'bg-[#e8fff3] text-[#50cd89]',
  Processing: 'bg-[#fff8dd] text-[#ffc700]',
};

const statusTranslations: Record<string, string> = {
  Authorized: 'Autorisé',
  Shipped: 'Expédié',
  Pending: 'En attente',
  Cancelled: 'Annulé',
  Completed: 'Complété',
  Processing: 'En cours',
};

export function RecentOrdersCard({ orders: initialOrders }: RecentOrdersCardProps) {
  const [orders, setOrders] = useState<RecentOrder[]>(initialOrders);
  const [limit, setLimit] = useState<string>('10');
  const [isLoading, setIsLoading] = useState(false);

  const handleLimitChange = async (newLimit: string) => {
    setLimit(newLimit);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/analytics/recent-orders?limit=${newLimit}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Commandes récentes</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Afficher:</span>
          <Select value={limit} onValueChange={handleLimitChange} disabled={isLoading}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading
        ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#009ef7]" />
            </div>
          )
        : orders.length === 0
          ? (
              <div className="py-8 text-center text-gray-500">
                Aucune commande récente disponible
              </div>
            )
          : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.orderNumber}
                    className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          #
                          {order.orderNumber}
                        </p>
                        <Badge
                          variant="secondary"
                          className={
                            statusColors[order.status as keyof typeof statusColors]
                            || 'bg-gray-100 text-gray-600'
                          }
                        >
                          {statusTranslations[order.status] || order.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(order.totalPrice)}
                        {' '}
                        FCFA
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
    </Card>
  );
}
