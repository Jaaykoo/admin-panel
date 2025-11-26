'use client';

import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';

export type ProductDeliveryProps = {
  itemsShipped: number;
  deliveries: Array<{
    item: string;
    recipient: string;
    status: string;
    date?: string;
  }>;
};

export function ProductDeliveryCard({ itemsShipped, deliveries }: ProductDeliveryProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Livraisons de produits
          </CardTitle>
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              {itemsShipped}
              {' '}
              expédiés
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deliveries.map((delivery, index) => (
            <div key={index} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              {/* Timeline dot */}
              <div className="relative mt-1">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                {index < deliveries.length - 1 && (
                  <div className="absolute left-1/2 top-2 h-full w-px -translate-x-1/2 bg-gray-200" />
                )}
              </div>

              {/* Delivery info */}
              <div className="flex-1">
                <div className="mb-1 font-semibold text-gray-900">{delivery.item}</div>
                <div className="mb-2 text-sm text-gray-500">
                  Destinataire:
                  {' '}
                  {delivery.recipient}
                </div>
                {delivery.date && (
                  <div className="mb-2 text-xs text-gray-400">{delivery.date}</div>
                )}
                <StatusBadge status={delivery.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

