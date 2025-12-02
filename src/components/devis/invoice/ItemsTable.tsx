'use client';

export type InvoiceItem = {
  id: number;
  reference?: string;
  designation?: string;
  quantity: number;
  unit?: string;
  unitPriceHT: string | number;
  tva: string | number;
  amountHT: string | number;
  amountTTC: string | number;
  image?: string;
};

type ItemsTableProps = {
  items: InvoiceItem[];
};

export function ItemsTable({ items }: ItemsTableProps) {
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              N°
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Désignation
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Reférence
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
              Quantité
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
              Prix unité HT
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
              TVA
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
              Montant HT
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
              Montant TTC
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {/* N° */}
              <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>

              {/* Article */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.designation}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.designation}</p>
                  </div>
                </div>
              </td>

              {/* Code */}
              <td className="px-4 py-3 text-center text-sm text-gray-700">
                {item.reference}
              </td>

              {/* Quantity */}
              <td className="px-4 py-3 text-center text-sm text-gray-700">
                {item.quantity}
                {item.unit && ` ${item.unit}`}
              </td>

              {/* Unit Price HT */}
              <td className="px-4 py-3 text-right text-sm text-gray-700">
                {formatCurrency(item.unitPriceHT)}
              </td>

              {/* TVA */}
              <td className="px-4 py-3 text-center text-sm text-gray-700">
                {item.tva}
                %
              </td>

              {/* Amount HT */}
              <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                {formatCurrency(item.amountHT)}
              </td>

              {/* Amount TTC */}
              <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                {formatCurrency(item.amountTTC)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
