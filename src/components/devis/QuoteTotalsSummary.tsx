'use client';

import type { QuoteItemForm } from './QuoteItemsFormTable';

type QuoteTotalsSummaryProps = {
  items: QuoteItemForm[];
};

export function QuoteTotalsSummary({ items }: QuoteTotalsSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotals = () => {
    let totalHT = 0;
    let totalTVA = 0;

    items.forEach((item) => {
      const unitPrice = Number.parseFloat(item.unit_price) || 0;
      const quantity = Number(item.quantity) || 0;
      const rate = Number.parseFloat(item.rate) || 0;

      const subtotal = unitPrice * quantity;
      const tva = subtotal * (rate / 100);

      totalHT += subtotal;
      totalTVA += tva;
    });

    const totalTTC = totalHT + totalTVA;

    return { totalHT, totalTVA, totalTTC };
  };

  const { totalHT, totalTVA, totalTTC } = calculateTotals();

  return (
    <div className="ml-auto w-80 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Total HT:</span>
        <span className="font-medium text-gray-900">{formatCurrency(totalHT)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Total TVA:</span>
        <span className="font-medium text-gray-900">{formatCurrency(totalTVA)}</span>
      </div>

      <div className="border-t border-gray-300 pt-3">
        <div className="flex justify-between">
          <span className="text-base font-semibold text-gray-900">Total TTC:</span>
          <span className="text-xl font-bold text-[#009ef7]">{formatCurrency(totalTTC)}</span>
        </div>
      </div>
    </div>
  );
}

