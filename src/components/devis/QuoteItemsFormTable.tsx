'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type QuoteItemForm = {
  product: number;
  title: string;
  image?: string;
  quantity: number;
  unit_price: string;
  rate: string;
};

type QuoteItemsFormTableProps = {
  items: QuoteItemForm[];
  onUpdateItem: (index: number, field: keyof QuoteItemForm, value: string | number) => void;
  onRemoveItem: (index: number) => void;
  errors?: Record<number, Record<string, string>>;
};

export function QuoteItemsFormTable({
  items,
  onUpdateItem,
  onRemoveItem,
  errors = {},
}: QuoteItemsFormTableProps) {
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const calculateSubtotal = (item: QuoteItemForm) => {
    const unitPrice = Number.parseFloat(item.unit_price) || 0;
    const quantity = Number(item.quantity) || 0;
    return unitPrice * quantity;
  };

  const calculateTotalTTC = (item: QuoteItemForm) => {
    const subtotal = calculateSubtotal(item);
    const rate = Number.parseFloat(item.rate) || 0;
    return subtotal * (1 + rate / 100);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-600">
          Aucun produit ajouté. Utilisez le bouton "Ajouter un produit" ci-dessus.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-12">#</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead className="w-28 text-center">Quantité</TableHead>
            <TableHead className="w-32 text-right">Prix unitaire (XOF)</TableHead>
            <TableHead className="w-28 text-center">TVA (%)</TableHead>
            <TableHead className="w-32 text-right">Total HT</TableHead>
            <TableHead className="w-32 text-right">Total TTC</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const subtotal = calculateSubtotal(item);
            const totalTTC = calculateTotalTTC(item);
            const itemErrors = errors[index] || {};

            return (
              <TableRow key={index}>
                {/* Index */}
                <TableCell className="font-medium text-gray-600">{index + 1}</TableCell>

                {/* Product */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded border">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{item.title}</span>
                  </div>
                </TableCell>

                {/* Quantity */}
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => onUpdateItem(index, 'quantity', Number(e.target.value))}
                    className={`text-center ${itemErrors.quantity ? 'border-red-500' : ''}`}
                  />
                  {itemErrors.quantity && (
                    <p className="mt-1 text-xs text-red-500">{itemErrors.quantity}</p>
                  )}
                </TableCell>

                {/* Unit Price */}
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={e => onUpdateItem(index, 'unit_price', e.target.value)}
                    className={`text-right ${itemErrors.unit_price ? 'border-red-500' : ''}`}
                  />
                  {itemErrors.unit_price && (
                    <p className="mt-1 text-xs text-red-500">{itemErrors.unit_price}</p>
                  )}
                </TableCell>

                {/* Rate/TVA */}
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={item.rate}
                    onChange={e => onUpdateItem(index, 'rate', e.target.value)}
                    className={`text-center ${itemErrors.rate ? 'border-red-500' : ''}`}
                  />
                  {itemErrors.rate && (
                    <p className="mt-1 text-xs text-red-500">{itemErrors.rate}</p>
                  )}
                </TableCell>

                {/* Total HT */}
                <TableCell className="text-right font-medium text-gray-900">
                  {formatCurrency(subtotal)}
                </TableCell>

                {/* Total TTC */}
                <TableCell className="text-right font-semibold text-gray-900">
                  {formatCurrency(totalTTC)}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
