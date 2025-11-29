'use client';

type InvoiceTotalsProps = {
  totalHT?: string | number;
  totalDebours?: string | number;
  totalTVA?: string | number;
  totalTTC: string | number;
};

export function InvoiceTotals({
  // totalHT,
  totalDebours,
  // totalTVA,
  totalTTC,
}: InvoiceTotalsProps) {
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  return (
    <div className="ml-auto w-80 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="space-y-2">
        {/* Total HT */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total HT</span>
          <span className="font-medium text-gray-900">{formatCurrency(totalTTC)}</span>
        </div>

        {/* Total Débours */}
        {totalDebours !== undefined && Number.parseFloat(String(totalDebours)) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total débours</span>
            <span className="font-medium text-gray-900">{formatCurrency(totalDebours)}</span>
          </div>
        )}

        {/* Total TVA */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total TVA</span>
          <span className="font-medium text-gray-900">{formatCurrency(0)}</span>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-300 pt-2" />

        {/* Total TTC */}
        <div className="flex justify-between">
          <span className="text-base font-semibold text-gray-900">Total TTC</span>
          <span className="text-xl font-bold text-[#009ef7]">{formatCurrency(totalTTC)}</span>
        </div>
      </div>
    </div>
  );
}
