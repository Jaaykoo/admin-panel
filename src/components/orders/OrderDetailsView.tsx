'use client';

import type { OrderDetail } from '@/types/OrderTypes';
import { Calendar, CreditCard, Mail, MapPin, Package, User } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrderStatusColor, getOrderStatusIcon, getOrderStatusLabel } from '@/types/OrderTypes';

type OrderDetailsViewProps = {
  order: OrderDetail;
};

export function OrderDetailsView({ order }: OrderDetailsViewProps) {
  const getStatusBadgeVariant = (status: string): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' => {
    const color = getOrderStatusColor(status as any);
    const variantMap = {
      default: 'default' as const,
      success: 'success' as const,
      warning: 'warning' as const,
      danger: 'destructive' as const,
      secondary: 'secondary' as const,
    };
    return variantMap[color] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Info principale et Paiement */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informations de la commande
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Numéro :</span>
              <span className="font-semibold">{order.number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Date :</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  {order.date_placed
                    ? new Date(order.date_placed).toLocaleString('fr-FR')
                    : 'N/A'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Statut :</span>
              <Badge variant={getStatusBadgeVariant(order.status)}>
                {getOrderStatusIcon(order.status)}
                {' '}
                {getOrderStatusLabel(order.status)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Méthode de livraison :</span>
              <span>{order.shipping_method || 'Non spécifiée'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Informations de paiement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total HT :</span>
              <span className="font-semibold">
                {Number(order.total_excl_tax).toLocaleString('fr-FR')}
                {' '}
                FCFA
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Frais de livraison :</span>
              <span>
                {order.shipping_incl_tax
                  ? `${Number(order.shipping_incl_tax).toLocaleString('fr-FR')} FCFA`
                  : '0 FCFA'}
              </span>
            </div>
            {order.offer_discounts && order.offer_discounts !== '0.00' && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Remises :</span>
                <span className="text-green-600">
                  -
                  {Number(order.offer_discounts).toLocaleString('fr-FR')}
                  {' '}
                  FCFA
                </span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Total TTC :</span>
              <span className="text-xl font-bold text-[#009ef7]">
                {Number(order.total_incl_tax).toLocaleString('fr-FR')}
                {' '}
                FCFA
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations client */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{order.email}</span>
            </div>
          )}

          {order.billing_address && (
            <div>
              <h4 className="mb-2 font-semibold">Adresse de facturation</h4>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                <div>
                  <p>
                    {order.billing_address.first_name}
                    {' '}
                    {order.billing_address.last_name}
                  </p>
                  <p>{order.billing_address.line1}</p>
                  {order.billing_address.line2 && <p>{order.billing_address.line2}</p>}
                  <p>
                    {order.billing_address.postcode}
                    {' '}
                    {order.billing_address.line4}
                  </p>
                  <p>{order.billing_address.country}</p>
                  {order.billing_address.phone_number && (
                    <p>
                      Tél :
                      {' '}
                      {order.billing_address.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {order.shipping_address && (
            <div>
              <h4 className="mb-2 font-semibold">Adresse de livraison</h4>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                <div>
                  <p>
                    {order.shipping_address.first_name}
                    {' '}
                    {order.shipping_address.last_name}
                  </p>
                  <p>{order.shipping_address.line1}</p>
                  {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                  <p>
                    {order.shipping_address.postcode}
                    {' '}
                    {order.shipping_address.line4}
                  </p>
                  <p>{order.shipping_address.country}</p>
                  {order.shipping_address.phone_number && (
                    <p>
                      Tél :
                      {' '}
                      {order.shipping_address.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Articles commandés */}
      <Card>
        <CardHeader>
          <CardTitle>
            Articles commandés (
            {order.lines.length}
            )
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-center">Quantité</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.lines.map(line => (
                <TableRow key={line.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded">
                        {line.product.images && line.product.images.length > 0 && line.product.images[0]?.original
                          ? (
                              <Image
                                src={line.product.images[0]!.original}
                                alt={line.product.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            )
                          : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                                N/A
                              </div>
                            )}
                      </div>
                      <div>
                        <p className="font-medium">{line.product.title}</p>
                        {line.attributes && line.attributes.length > 0 && (
                          <p className="text-xs text-gray-500">
                            {line.attributes.map(attr => attr.value).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{line.quantity}</TableCell>
                  <TableCell className="text-right">
                    {Number(line.price_incl_tax).toLocaleString('fr-FR')}
                    {' '}
                    FCFA
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {(Number(line.price_incl_tax) * line.quantity).toLocaleString('fr-FR')}
                    {' '}
                    FCFA
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
