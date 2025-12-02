'use client';

import type { ProductDelivery } from '@/types/AnalyticType';
import { Package } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type ProductDeliveryCardWrapperProps = {
  itemsShipped: number;
  deliveries: ProductDelivery[];
};

const statusMapping: Record<string, { label: string; color: string }> = {
  delivered: { label: 'Livré', color: 'bg-[#e8fff3] text-[#50cd89]' },
  shipped: { label: 'Expédié', color: 'bg-[#fff8dd] text-[#ffc700]' },
  processing: { label: 'En cours', color: 'bg-[#f8f5ff] text-[#7239ea]' },
  pending: { label: 'En attente', color: 'bg-[#f1f1f4] text-[#7e8299]' },
};

export function ProductDeliveryCardWrapper({
  itemsShipped: initialItemsShipped,
  deliveries: initialDeliveries,
}: ProductDeliveryCardWrapperProps) {
  const [itemsShipped, setItemsShipped] = useState(initialItemsShipped);
  const [deliveries, setDeliveries] = useState<ProductDelivery[]>(initialDeliveries);
  const [limit, setLimit] = useState<string>('10');
  const [isLoading, setIsLoading] = useState(false);

  const handleLimitChange = async (newLimit: string) => {
    setLimit(newLimit);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/analytics/product-delivery?limit=${newLimit}`);
      if (response.ok) {
        const data = await response.json();
        setItemsShipped(data.itemsShipped);
        setDeliveries(data.deliveries);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des livraisons:', error);
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fonction pour déterminer le statut basé sur la date de livraison
  const getDeliveryStatus = (deliveryDate: string) => {
    const now = new Date();
    const delivery = new Date(deliveryDate);
    const diffInHours = (delivery.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < -24) {
      return 'delivered';
    }
    if (diffInHours < 0) {
      return 'shipped';
    }
    if (diffInHours < 24) {
      return 'processing';
    }
    return 'pending';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Livraisons de produits
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">
                {itemsShipped}
                {' '}
                expédiés
              </span>
            </div>
            <div className="flex items-center gap-2">
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
        </div>
      </CardHeader>
      <CardContent>
        {isLoading
          ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#009ef7]" />
              </div>
            )
          : deliveries.length === 0
            ? (
                <div className="py-8 text-center text-gray-500">
                  Aucune livraison disponible
                </div>
              )
            : (
                <div className="space-y-4">
                  {deliveries.map((delivery, index) => {
                    const status = getDeliveryStatus(delivery.deliveryDate);
                    const statusInfo = statusMapping[status] || statusMapping.pending;

                    return (
                      <div
                        key={index}
                        className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        {/* Timeline dot */}
                        <div className="relative mt-1">
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                          {index < deliveries.length - 1 && (
                            <div className="absolute top-2 left-1/2 h-full w-px -translate-x-1/2 bg-gray-200" />
                          )}
                        </div>

                        {/* Delivery info */}
                        <div className="flex-1">
                          <div className="mb-1 font-semibold text-gray-900">
                            {delivery.productName}
                          </div>
                          <div className="mb-2 text-sm text-gray-500">
                            Destinataire:
                            {' '}
                            {delivery.recipientName}
                          </div>
                          <div className="mb-2 text-xs text-gray-400">
                            {formatDate(delivery.deliveryDate)}
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo?.color}`}
                          >
                            {statusInfo?.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
      </CardContent>
    </Card>
  );
}
